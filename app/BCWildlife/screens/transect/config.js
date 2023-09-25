/*
 * Input config:
 * - name: identifier
 * - databaseFieldName, displayName, type, optional: as in the customer-provided table
 * - defaultValue: function of "params" to supply the default value; empty string is default
 * - editable
 * - inputType: one of 'text', 'choice', 'date'
 * - choices: Array<{ id: number, name: string}> for inputType 'choice'
 * - ifForm: (form: Form) => boolean, whether to display the input
 *
 * Params:
 *   - initials
 *   - timestamp
 *   - transectNumber
 */

import {
  scatSurveyType,
  snowTrackSurveyType,
  transectConstants,
  transectDefaults,
} from '../../constants/transect/transect';
import {nextEncounterId} from './navigation';
import { utm10ToLatLon } from "../../shared/utils/convertCoords";

export const transectConfig = {
  title: 'Transect survey',
  inputs: [
    {
      name: 'fieldCrew',
      databaseFieldName: 'Field_crew',
      displayName: 'Field Crew',
      type: 'string',
      optional: false,
      inputType: 'text',
      defaultValue: undefined,
      placeholder: 'Enter field crew',
    },
    {
      name: 'dateTime',
      databaseFieldName: 'Date_Time',
      displayNameDate: 'Date',
      displayNameTime: 'Time',
      type: 'date',
      optional: false,
      inputType: 'timestamp',
      mode: 'datetime',
      editable: true,
      dateTextFormat: date => {
        const dd = date.getDate().toString().padStart(2, '0');
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      },
      timeTextFormat: date => {
        const hh = date.getHours().toString().padStart(2, '0');
        const mm = date.getMinutes().toString().padStart(2, '0');
        return `${hh}:${mm}`;
      },
      defaultValue: ({timestamp}) => timestamp,
    },
    {
      name: 'transectId',
      databaseFieldName: 'Transect_ID',
      displayName: 'Transect ID',
      type: 'string',
      optional: false,
      inputType: 'text',
      editable: false,
      defaultValue: ({initials, timestamp, transectNumber}) => {
        const date = new Date(timestamp);
        const dd = date.getDate().toString().padStart(2, '0');
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const yyyy = date.getFullYear();
        const transect = transectNumber.toString().padStart(2, '0');
        return `${initials}_${dd}${mm}${yyyy}_${transect}`;
      },
    },
    {
      name: 'gpsId',
      databaseFieldName: 'GPS_ID',
      displayName: 'GPS ID',
      type: 'string',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter GPS ID',
    },
    {
      name: 'coordinateLongitudeStart',
      displayName: 'Start coordinate (Longitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Longitude',
    },
    {
      name: 'coordinateLatitudeStart',
      displayName: 'Start coordinate (Latitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Latitude',
    },
    {
      name: 'coordinateEastingStart',
      databaseFieldName: 'Coordinate_Easting_start',
      displayName: 'Start coordinate (Easting, UTM10)',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter easting',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(text, form.coordinateNorthingStart);
        setForm(draft => {
          draft.coordinateLatitudeStart = (lat ?? '').toString();
          draft.coordinateLongitudeStart = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'coordinateNorthingStart',
      databaseFieldName: 'Coordinate_Northing_start',
      displayName: 'Start coordinate (Northing, UTM10)',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter northing',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(form.coordinateEastingStart, text);
        setForm(draft => {
          draft.coordinateLatitudeStart = (lat ?? '').toString();
          draft.coordinateLongitudeStart = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'getCurrentCoordinatesButton',
      displayName: 'Get current location',
      inputType: 'coordinates_button',
      coordinateNorthing: 'coordinateNorthingStart',
      coordinateEasting: 'coordinateEastingStart',
      coordinateLongitude: 'coordinateLongitudeStart',
      coordinateLatitude: 'coordinateLatitudeStart',
      optional: true,
    },
    {
      name: 'bearingStart',
      databaseFieldName: 'Bearing_start',
      displayName: 'Start Bearing',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter bearing',
      hint: 'The bearing followed for the first 500 m of the transect.',
    },
    {
      name: 'surveyType',
      databaseFieldName: 'Survey_Type',
      displayName: 'Survey Type',
      optional: false,
      inputType: 'choice',
      choices: transectConstants.surveyType,
      editable: true,
      defaultValue: () => transectDefaults.surveyType,
    },
    {
      name: 'snowDate',
      databaseFieldName: 'Snow_date',
      displayName: 'Date Last Snow',
      type: 'date',
      optional: false,
      inputType: 'timestamp',
      mode: 'date',
      textFormat: date => {
        const dd = date.getDate().toString().padStart(2, '0');
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      },
      editable: true,
      defaultValue: ({timestamp}) => timestamp,
      ifForm: form => form.surveyType === snowTrackSurveyType,
    },
    {
      name: 'snowDepth',
      databaseFieldName: 'Snow_depth',
      displayName: 'Snow Depth',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: () => '0',
      ifForm: form => form.surveyType === snowTrackSurveyType,
      hint: 'Total depth of snow on transect (cm). Measure at 3 places and take average.',
    },
    {
      name: 'snowAmount',
      databaseFieldName: 'Snow_amount',
      displayName: 'Snow Amount',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: () => '0',
      ifForm: form => form.surveyType === snowTrackSurveyType,
      hint: 'Total amount of snow that fell in the last snowfall (cm). Can be best measured on snowmobile trail.',
    },
    {
      name: 'cloudCover',
      databaseFieldName: 'Cloud_cover',
      displayName: 'Cloud Cover',
      optional: false,
      inputType: 'choice',
      choices: transectConstants.cloudCover,
      editable: true,
      defaultValue: () => transectDefaults.cloudCover,
    },
    {
      name: 'precipitation',
      databaseFieldName: 'Precipitation',
      displayName: 'Precipitation',
      optional: false,
      inputType: 'choice',
      choices: transectConstants.precipitation,
      editable: true,
      defaultValue: () => transectDefaults.precipitation,
    },
    {
      name: 'wind',
      databaseFieldName: 'Wind',
      displayName: 'Wind',
      type: 'int',
      optional: false,
      inputType: 'choice',
      choices: transectConstants.wind,
      editable: true,
      defaultValue: () => transectDefaults.wind,
    },
    {
      name: 'temperature',
      databaseFieldName: 'Temperature',
      displayName: 'Temperature',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter temperature',
      hint: 'Ambient temperature at time of survey (°C).',
    },
    {
      name: 'transectTrackShapefile',
      databaseFieldName: 'transectTrackShapefile',
      displayName: 'Transect Track Shapefile',
      type: 'string',
      optional: true,
      defaultValue: undefined,
      placeholder: 'Enter GPS file (optional)',
    },
    {
      name: 'encounterWaypointsShapefile',
      databaseFieldName: 'encounterWaypointsShapefile',
      displayName: 'Encounter Waypoints Shapefile',
      type: 'string',
      optional: true,
      defaultValue: undefined,
      placeholder: 'Enter GPS file (optional)',
    },
    {
      name: 'transectLength',
      databaseFieldName: 'Transect_length',
      displayName: 'Transect Length',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter transect length',
      hint: 'Total distance (m) survyed at the end of the transect.',
    },
    {
      name: 'coordinateLongitudeEnd',
      displayName: 'End coordinate (Longitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Longitude',
    },
    {
      name: 'coordinateLatitudeEnd',
      displayName: 'End coordinate (Latitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Latitude',
    },
    {
      name: 'coordinateEastingEnd',
      databaseFieldName: 'Coordinate_Easting_end',
      displayName: 'End coordinate (Easting, UTM10)',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter easting',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(text, form.coordinateNorthingEnd);
        setForm(draft => {
          draft.coordinateLatitudeEnd = (lat ?? '').toString();
          draft.coordinateLongitudeEnd = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'coordinateNorthingEnd',
      databaseFieldName: 'Coordinate_Northing_end',
      displayName: 'End coordinate (Northing, UTM10)',
      type: 'float',
      optional: false,
      inputType: 'text',
      editable: true,
      defaultValue: undefined,
      placeholder: 'Enter northing',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(form.coordinateEastingEnd, text);
        setForm(draft => {
          draft.coordinateLatitudeEnd = (lat ?? '').toString();
          draft.coordinateLongitudeEnd = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'getCurrentEndCoordinatesButton',
      displayName: 'Get current location',
      inputType: 'coordinates_button',
      coordinateNorthing: 'coordinateNorthingEnd',
      coordinateEasting: 'coordinateEastingEnd',
      coordinateLongitude: 'coordinateLongitudeEnd',
      coordinateLatitude: 'coordinateLatitudeEnd',
      optional: true,
    },
  ],
  getDefaultValues: state => state.defaultValues,
};

export const standConfig = {
  title: 'Stand',
  hint: 'Record data for each stand encountered along the transect. Minimum “recognizable” stand size is 1.5 ha (e.g., 150 m x 100 m).',
  inputs: [
    {
      name: 'id',
      databaseFieldName: 'Stand_ID',
      displayName: 'Stand ID',
      type: 'string',
      optional: false,
      editable: false,
    },
    {
      name: 'distanceAlongTransect',
      databaseFieldName: 'Distance_along_transect',
      displayName: 'Distance along Transect',
      type: 'float',
      optional: false,
      defaultValue: undefined,
      placeholder: 'Enter distance along transect',
      hint: 'Distance along transect in metres that the edge between stands is observed.',
    },
    {
      name: 'coordinateLongitude',
      displayName: 'Coordinate (Longitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Longitude',
    },
    {
      name: 'coordinateLatitude',
      displayName: 'Coordinate (Latitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Latitude',
    },
    {
      name: 'coordinateEasting',
      databaseFieldName: 'Coordinate_Easting',
      displayName: 'Coordinate (Easting, UTM10)',
      type: 'float',
      optional: false,
      defaultValue: undefined,
      placeholder: 'Enter easting',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(text, form.coordinateNorthing);
        setForm(draft => {
          draft.coordinateLatitude = (lat ?? '').toString();
          draft.coordinateLongitude = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'coordinateNorthing',
      databaseFieldName: 'Coordinate_Northing',
      displayName: 'Coordinate (Northing, UTM10)',
      type: 'float',
      optional: false,
      defaultValue: undefined,
      placeholder: 'Enter northing',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(form.coordinateEasting, text);
        setForm(draft => {
          draft.coordinateLatitude = (lat ?? '').toString();
          draft.coordinateLongitude = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'getCurrentCoordinatesButton',
      displayName: 'Get current location',
      inputType: 'coordinates_button',
      coordinateNorthing: 'coordinateNorthing',
      coordinateEasting: 'coordinateEasting',
      coordinateLongitude: 'coordinateLongitude',
      coordinateLatitude: 'coordinateLatitude',
      optional: true,
    },
    {
      name: 'beu',
      databaseFieldName: 'BEU',
      displayName: 'Broad Ecosystem Unit',
      // TODO spec mentions the BEU type; it's unclear whether it's an
      // enumeration that can be hardcoded or a list of options to be
      // downloaded.  Let it be a string for now.
      type: 'string',
      optional: true,
      defaultValue: undefined,
      placeholder: 'Enter BEU (optional)',
      hint: 'Broad Ecosystem Unit of the stand you are entering. See BEU key to aid in identification.',
    },
    {
      name: 'siteSeries',
      databaseFieldName: 'Site_series',
      displayName: 'Site Series',
      type: 'string',
      optional: true,
      defaultValue: undefined,
      placeholder: 'Enter site series (optional)',
      hint: '2- or 3-character label for the site series of the stand you are entering. See site series key to aid in identification. Note seral associations begin with “$”. If the stand is intermediate between 2 site series or you are unsure of the classification, record the most likely or prominent unit, followed by the other unit in brackets [e.g., 01(05)]. If in a non-forested unit, record the 2-letter code for the ecosystem (e.g., CF for cultivated field).',
    },
    {
      name: 'structuralStage',
      databaseFieldName: 'Structural_stage',
      displayName: 'Structural Stage',
      type: 'string',
      optional: true,
      defaultValue: undefined,
      placeholder: 'Enter structural stage (optional)',
      hint: '1- or 2-letter code for the structural stage of stand you are entering',
    },
  ],
  getDefaultValues: state => state.defaultValues,
};

export const encounterConfig = {
  title: 'Encounter',
  inputs: [
    {
      name: 'standId',
      databaseFieldName: 'Stand_ID',
      displayName: 'Stand ID',
      type: 'string',
      optional: false,
      editable: false,
      defaultValue: undefined,
    },
    {
      name: 'id',
      databaseFieldName: 'Observation_ID',
      displayName: 'Observation ID',
      type: 'int',
      optional: false,
      editable: false,
      defaultValue: undefined,
    },
    {
      name: 'coordinateLongitudeObservation',
      displayName: 'Coordinate (Longitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Longitude',
    },
    {
      name: 'coordinateLatitudeObservation',
      displayName: 'Coordinate (Latitude)',
      type: 'float',
      optional: true,
      inputType: 'text',
      editable: false,
      defaultValue: undefined,
      placeholder: 'Latitude',
    },
    {
      name: 'coordinateEastingObservation',
      databaseFieldName: 'Coordinate_Easting_observation',
      displayName: 'Coordinate (Easting, UTM10)',
      type: 'float',
      optional: false,
      defaultValue: undefined,
      placeholder: 'Enter easting',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(
          text,
          form.coordinateNorthingObservation,
        );
        setForm(draft => {
          draft.coordinateLatitudeObservation = (lat ?? '').toString();
          draft.coordinateLongitudeObservation = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'coordinateNorthingObservation',
      databaseFieldName: 'Coordinate_Northing_observation',
      displayName: 'Coordinate (Northing, UTM10)',
      type: 'float',
      optional: false,
      defaultValue: undefined,
      placeholder: 'Enter northing',
      onChangeTextCustom: (name, text, form, setForm) => {
        const {lat, lon} = utm10ToLatLon(
          form.coordinateEastingObservation,
          text,
        );
        setForm(draft => {
          draft.coordinateLatitudeObservation = (lat ?? '').toString();
          draft.coordinateLongitudeObservation = (lon ?? '').toString();
        });
      },
    },
    {
      name: 'getCurrentCoordinatesButton',
      displayName: 'Get current location',
      inputType: 'coordinates_button',
      coordinateNorthing: 'coordinateNorthingObservation',
      coordinateEasting: 'coordinateEastingObservation',
      coordinateLongitude: 'coordinateLongitudeObservation',
      coordinateLatitude: 'coordinateLatitudeObservation',
      optional: true,
    },
    {
      name: 'waypoint',
      databaseFieldName: 'Waypoint',
      displayName: 'Waypoint',
      type: 'string',
      optional: false,
      defaultValue: undefined,
      placeholder: 'Enter wayport',
      hint: 'The name of the waypoint for the observation.',
    },
    {
      name: 'distanceAlongTransect',
      databaseFieldName: 'Distance_along_transect',
      displayName: 'Distance along Transect',
      type: 'float',
      optional: false,
      defaultValue: undefined,
      placeholder: 'Enter distance along transect',
      hint: 'Distance along transect in metres where the track is first observed.',
    },
    {
      name: 'species',
      databaseFieldName: 'Species',
      displayName: 'Species',
      optional: false,
      inputType: 'choice',
      choices: transectConstants.species,
      editable: true,
      defaultValue: () => transectDefaults.species,
      hint: '4-letter species code of potential prey and mustelids.',
    },
    {
      name: 'reliability',
      databaseFieldName: 'Reliability',
      displayName: 'Reliability',
      type: 'string',
      optional: false,
      inputType: 'choice',
      choices: transectConstants.reliability,
      editable: true,
      defaultValue: () => transectDefaults.reliability,
      hint: 'Assess the certainty of the species identification with one of the provided codes.',
    },
    {
      name: 'numberOfObservations',
      databaseFieldName: 'Number_of_observations',
      displayName: 'Number of Observations',
      optional: true,
      inputType: 'choice',
      choices: transectConstants.numberOfObservations,
      editable: true,
      defaultValue: () => transectDefaults.numberOfObservations,
      hint: 'Number of tracks or scats counted usng one of the provided codes.',
    },
    {
      name: 'comments',
      databaseFieldName: 'Comments',
      displayName: 'Comments',
      type: 'string',
      optional: true,
      defaultValue: undefined,
      placeholder: 'Enter comments (optional)',
    },
    {
      name: 'scatId',
      databaseFieldName: 'Scat_ID',
      displayName: 'Scat ID',
      type: 'string',
      optional: true,
      editable: false,
      ifState: state => state.transect.surveyType === scatSurveyType,
      defaultValue: ({
        initials,
        timestamp,
        transectNumber,
        standId,
        encounterId,
      }) => {
        const date = new Date(timestamp);
        const dd = date.getDate().toString().padStart(2, '0');
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const yyyy = date.getFullYear();
        const transect = transectNumber.toString().padStart(2, '0');
        const stand = standId.toString().padStart(2, '0');
        const observation = encounterId.toString().padStart(2, '0');
        return `${initials}_${dd}${mm}${yyyy}_${transect}_${stand}_${observation}`;
      },
    },
  ],
  getDefaultValues: state => ({
    ...state.defaultValues,
    standId: state.stand.id,
    encounterId: nextEncounterId(state),
  }),
};

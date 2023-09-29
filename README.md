Wildlife Datacapture App
========================


Overview
--------

The app allows the user to fill in observation sheets and submit them to the
server.  The data is stored in a database and image folders.


UI
--

The Dashboard gives access to various surveys, admin tasks (in the case of
admin accounts), and the Profile screen.  A typical workflow is as follows:

- The user logs in when an Internet connection exists.
- Filling in observation forms, in general, does not require an Internet
  connection.
- In order to send locally stored data to the server, go to the Profile screen
  and press the “Sync Offline Data” button.

**Important!**  The data is NOT sent to the server automatically after a form
has been filled in.

The profile picture can be set on the Profile screen by clicking the picture.

Export is not supported at the moment.


Back end
--------

### Database

The back end uses PostgresSQL.  The data is stored in the database `wildlife`.

#### Animals

The table `animals` is a list of animal species that can be referenced in
observations.

- `id`: internal ID to be used by other tables.
- `stringId`, `name`: presented to the user.

Users can define and edit animals.

#### Bridges

The table `bridges` is a list of internal bridge IDs that can be referenced in
observations (most notably, by the Bat Survey).

#### Aerial Telemetry

The tables starting with `at_` contain data related to aerial telemetry.

The tables starting with `at_def_` define constants for enumerated values.
These tables are populated automatically and normally, they do not change.

The tables starting with `at_data` hold the data of observations.  The
`at_data` is the main table.

#### Bridges and Bats

The tables starting with `bb_` contain data related to observations of bridges
and bats (the Bridge and Bat Survey screens).

The tables starting with `bb_def_` define constants for enumerated values.
These tables are populated automatically and normally, they do not change.  The
`id` columns are referenced by other tables with the exception of `bb_def_fors`
and `bb_def_bat_recordings`.  The values of the `bit` and `id` columns of the
respective tables are used in bitmasks for encoding multiple choices.

The tables starting with `bb_data_` hold the data of observations.  The table
`bb_data_observations` is the main one.

The database does not assume that any characteristic of a bridge may not
change.  Still, data related to bridges can be grouped as stable (bridge name,
MOT ID, material, etc.) and observation-specific (water currently under bridge,
etc.).

Stable bridge data goes into `bb_data_bridge_configuration`.  If a stable
characteristic changes, a new timestamped row is created, but the old row is
not deleted.  Thus, it is possible to restore the bridge condition at the time
of a given bat survey.  

Observation-specific bridge data go to `bb_data_observations`.

The `bb_data_observations` table has the column `userDateTime` for the time
entered by the user and the column `time` for reliable automatically generated
time of observation.

#### Camera Trap Metadata

The form data is stored in the tables `camera_trap_data` and
`camera_trap_data_photos` in a straightforward way.

#### Management

The `projects`, `project_accesses` and `users` tables hold data related to user
and project management.

#### Regions

The `regions` table introduces enumeration constants for regions.  This table
is populated automatically.

#### Telemetry

The form data is stored in the table `telemetry_data` in a straightforward way.

#### Transects

The tables starting with `tr_` contain data related to observations of transects.

The tables starting with `tr_def_` define constants for enumerated values.
These tables are populated automatically and normally, they do not change. The
tables starting with `tr_data_` hold the data of observations.

The `bb_data_transects` table has the column `Date_Time` for the time entered
by the user and the column `time` for reliable automatically generated time of
observation.


### Images

Uploaded images are stored under `uploads/images` (relative to the back end
workind directory) under random names.

The profile image for an account `my-account` is stored as
`uploads/profileImages/my-account`.

Setup
-----

### Back end

Database configuration profiles are stored in `backend/src/config/config.json`.
The profile is chosen according to the value of the environmental variable
`NODE_ENV`.

The back end assumes the `wildlife` database.  It creates and populates tables
as needed.

#### Dev setup

Here is a simple local setup for development purposes.  Assume that the
directory `setup` is beside the directory `bcwild` with the project code.  Make
sure that `setup` has the following structure:

    setup
    ├── data
    ├── docker-compose.yml
    └── Dockerfile

where `data` is an initially empty directory, `Dockerfile` contains

    FROM node
    RUN npm install -g nodemon
    USER node

and `docker-compose.yml` contains

    services:
      pgadmin:
        image: dpage/pgadmin4
        ports:
          - 18009:80
        environment:
          - PGADMIN_DEFAULT_EMAIL=foo@bar.baz
          - PGADMIN_DEFAULT_PASSWORD=foo
      db:
        image: postgres
        environment:
          - POSTGRES_USER=postgres
          - POSTGRES_PASSWORD=admin
          - PGDATA=/var/lib/postgresql/data/pgdata
        volumes:
          - ./data:/var/lib/postgresql/data
        ports:
          - 5432:5432
      backend:
        build: .
        environment:
          - DB_HOST=db
          - DB_USER=postgres
          - DB_PASSWORD=admin
          - NODE_ENV=local2
        volumes:
          - ../bcwild/backend:/backend
        working_dir: /backend
        command: "yarn start"
        ports:
          - 4000:4000


### Front end

The IP address of the server is defined in `app/BCWildlife/network/path.js`.

Deploy
---

The back-end is deployed on Digital Ocean.

To successfully deploy a new version you need to:
1. Go to `/root/backend/bcwild/backend`
2. Execute `git pull`
3. If you changed any dependencies, execute `npm install`
4. Make sure you have the `.env` file with the following arguments:
   1. EMAIL (for sending emails during sign up and account approval)
   2. EMAIL_PASS
5. Check `src/config/config.json`, `local` config and make sure the database parameters are correct.
6. If an instance of the backend is already running, find it and kill it: `ps -aux | grep index.js` -> find pid (for example `3360100`) -> `kill <pid>`
7. A new instance of the backend will start automatically, you check by executing `ps -aux | grep index.js` again and checking the pid, it should be different.
   1. If a new instance did not start automatically, execute `node /root/backend/bcwild/backend/index.js`.

API
---

Where a form requires choosing among predefined options, these options are
normally encoded as integers.  Enumerations used by the back end are defined in
json files under backend/src/datasheettypes/`.


Code
----

Both the back end and the app are built with node 20.4.0.
 
The app can be built for Android and iOS.

Building mobile apps
---

### Android

To launch the app for debug execute `npm run android` in `app/BCWildlife`.

To assemble a release APK execute script `buildAndroidRelease.sh`. Be aware that for uploading the build to Google Play you need to assemble an App Bundle instead of APK, and it should be signed by the upload key. See `Certificates` section to find out where to find the keys.

Assembled APK are stored in `app/BCWildlife/android/app/build/outputs/apk`, then `release` or `debug` depending on what variant you assembled.

Assembled App Bundles are stored in `app/BCWildlife/android/app/build/outputs/bundle`.

### iOS

To launch the app for debug go to `app/BCWildlife/ios` and execute `pod install`. After that go to `app/BCWildlife` and execute `npm run ios`. Alternatively instead of the last step open Xcode and launch the app normally from there.

To assemble a release ipa push any commit to the repo https://github.com/bcgov/bcwild. An action will be invoked, assembling an ipa signed for uploading to the App Store. To upload the ipa to the App Store, use `app/BCWildlife/uploadIpa.sh` script.

Usage: `./uploadIpa.sh <path to ipa> <apple developer account email> <apple app specific password>`. 

Read more about app specific passwords here https://support.apple.com/en-us/102654.

### Certificates

The code itself does not contain any sensitive information. The certificates for building ios and android release builds are stores in github secrets. Main contact for that is Monica Granbois. 

The passwords for the database and the email account are stored in the deployed code on Digital Ocean.

The back-end currently does not have a valid SSL certificates and all the communication between the back-end and the app is done in cleartext.

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiURL: 'developmentApi',
      firebase: {
          apiKey: 'AIzaSyCfTppkvia495FafQbJu5a3z-QHgDzXSjQ',
          authDomain: 'dronesca-pe.firebaseapp.com',
          databaseURL: 'https://dronesca-pe.firebaseio.com',
          projectId: 'dronesca-pe',
          storageBucket: 'dronesca-pe.appspot.com',
          messagingSenderId: '437729579897'
      }
};

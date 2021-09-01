## Project [![Build Status](https://travis-ci.com/Rutle/fazla.svg?branch=master)](https://travis-ci.com/Rutle/fazla)

This project is a Azur Lane mobile game fan application for formation management. There is a webapp version at [github pages](http://rutle.github.io/fazla) and then a desktop application using Electron. There is no release yet for the desktop application, but it can be built and is fully usable.

Main idea behind this project was to learn more Electron, Typescript and React.

Project was started using Create-React-App, but I ended up ejecting it due to conflicts in electron build. For that reason
it lacks functionality such as web server for quick testing of changes.

### Main packages
* Electron
* React
* Redux
* Typescript
 
### Misc
* Uses raw ship data from [AzurApi-JS](https://azurapi.github.io/).
* Webapp stores data into IndexedDB. There is no backend.
* Webapp updates/downloads raw data on first load, when there is missing data in IndexedDB or there is new update/7 days has passed since last update.
* Electron version stores data locally.

### Builds
* Web (dev)
`npm run web-dev`
* Web (prod)
`npm run web-prod`
* Electron (dev)
`npm run dev`
* Electron (prod)
`npm run prod`
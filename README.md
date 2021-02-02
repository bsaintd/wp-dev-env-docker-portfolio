# WordPress Development Environment 
This a reusable configuration for WordPress projects

## Get Started 
1. Add wordpress theme files, plugins, media in the wordpress folder
2. `npm install`
3. `docker-compose up`

## Synchronize with WP Engine
If you have SSH access configured on your WP Engine account, you can use the `sync-wpengine.sh` script to copy your media files and plugins from a WP Engine environment to your local environment.

## Notes
Uses webpack to compile JavaScript and Sass
You must configure the path to your theme in the webpack configuration
It expects a `src` folder in the theme from which to find Scss and Js files
Put a SQL file in the `sql` folder if you want to bootstrap your wordpress installation with it

phpMyAdmin runs on port 22222 and the default credentials are `root : root`


# DEPLOYMENT IN A SINGLE SERVER

1. Deploy the backend standalone (follow heroku instructions).
2. In heroku go to project settings/ reveal config vars (set environment variables).
3. Remember in the app.listen to listen to port process.env.port
4. Add, commit, git push heroku master
5. Im the frontend .env.production set the environment variable to the deployed API URL!
6. npm run build
7. Grab the build folder content from the frontend and paste it to the back end inside a folder (maybe named public or client).
8. Test it with npm run dev before you push changes to heroku.
9. Repeat step 4 !

---
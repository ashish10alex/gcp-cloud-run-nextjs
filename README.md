### Deploy Next JS web app using Cloud Run

1. Clone repository

2. gcloud setup

```
gcloud init
```

```
gcloud auth application-default login
```

```
gcloud config set project drawingfire-b72a8 # replace with your gcp project id
```

> Note
Reload your window using ctrl + shift + p and selecting reload window for the default project setting to take
affect

3. Install dependencies
```bash
npm install
```

3. Check if you are able to run the app locally
```bash
npm run dev
```

> Note
Change the query in `src/app/api/get_data_from_bigquery/route.ts` to a query you would like to see the results of on the browser. The results are shown in json format


3. Deploy on Cloud Run (assumes you have enabled app engine & have the neccessary permissios)


>Follow commands in justfile for now, we will add more stuff here later

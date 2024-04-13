This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Install Project In Your Device

1. Clone project
   
   ```bash
   git clone https://github.com/jalun118/dashboard-treasurer.git
   ```
3. Install all package
   
   ```bash
   npm install
   # or
   yarn add
   # or
   pnpm install
   ```

## Getting Started

First, create an `env` file in the root project directory with following contents:

```bash
# mongo db url (required)
MONGODB_URI=mongodb://localhost:27017/<your-database>

# next url redirect host (required)
NEXTAUTH_URL=http://localhost:3000

# next random secret token (required)
NEXTAUTH_SECRET=<your-random-token>
```

Second, open your mongo db and create a collection named `administrators` then paste the following code

1. With Mongodb Compas

```json
{
  "name": "super admin",
  "username": "admin",
  "password": "$2b$10$O4GbomLdN.9lEfgtDjG.Zeedmt6aORUT4btAv4f4UFagl8YHnguwK",
  "role": "super-admin",
  "sid": "DGM3f2MLtfzXYfAgk3rB",
  "createdAt": {
    "$date": "2024-04-09T06:31:09.318Z"
  },
  "updatedAt": {
    "$date": "2024-04-13T08:02:20.053Z"
  },
  "__v": 0
}
```

2. With `mongosh`

```javascript
db.administrator.insertOne({
  name: "super admin",
  username: "admin",
  password: "$2b$10$O4GbomLdN.9lEfgtDjG.Zeedmt6aORUT4btAv4f4UFagl8YHnguwK",
  role: "super-admin",
  sid: "DGM3f2MLtfzXYfAgk3rB",
  createdAt: new ISODate("2024-04-09T06:31:09.318Z"),
  updatedAt: new ISODate("2024-04-09T06:31:09.318Z"),
  __v: 0,
});
```

Third, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Default Account Login

```bash
# permanent username for admin
username: admin

# temporary password for admin
password: admin
```

## Error Solving On First Time Open

1. After the pop up appears, press the button that says "TO INITIAL ==>".
2. Wait for the page to change.
3. Fill out the form that has been provided.
4. When finished press the save button.
5. Wait for the process to finish.
6. If you have finished and everything is in order, please go to the main page.

## Note

If when sending then everything `worked` but `some didn't work` when you `send it again` the `previously successful field` will `display an error message` because `the system sent a field that already exists`, but if at that time the `previously failed field` when sent `worked` then the other `sends a duplicate key message` then you have `successfully solved the problem` the first time it is opened.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

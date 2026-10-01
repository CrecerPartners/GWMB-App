# GWMB – Girls Who Mean Business

Production mobile application for Android and iOS, built with React Native, Expo SDK 57 and TypeScript.

## Identifiers

- Display name: `GWMB – Girls Who Mean Business`
- Android package: `org.girlswhomeanbusiness.app`
- URL scheme: `gwmb://`

## Run locally

```bash
npm install
npm start
```

Use Expo Go for the current foundation. Development builds will be introduced when native-only services are added.

## Supabase

Copy `.env.example` to `.env.local` and enter the project URL and public anon key. Never place a service-role key in the app or commit it to source control.

The database migrations in `supabase/migrations` keep membership verification and opportunity-status decisions server-controlled. They also persist course progress, the complete Events journey—including registrations, waitlists and cancellation—and the account journey for profile updates, profile photos, membership applications, and membership-verification requests.

Submitting an application or verification request places an eligible account into a pending state. Only trusted GWMB administrative code can activate verified membership access.

## Android builds

EAS Build is configured in `eas.json` with two Android profiles:

- `preview` produces a signed APK for direct installation and internal testing.
- `production` produces a signed Android App Bundle for Google Play.

The project uses EAS-managed remote build numbers. The Supabase public URL and anon key must be stored in both the EAS `preview` and `production` environments because `.env.local` is intentionally excluded from cloud builds.

```bash
npx eas-cli@latest build --platform android --profile preview
```

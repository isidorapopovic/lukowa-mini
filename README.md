# Minimal Pathflow form (Node + PostgreSQL)

This is a stripped-down version of the original repository.
It keeps only the essentials for a simple candidate input form.

## Fields
- name
- age
- position
- experience level
- notes

## Setup
1. Copy `.env.example` to `.env`
2. Run `npm install`
3. Run `npm run init-db`
4. Run `npm start`
5. Open `http://localhost:6000`

## Routes
- `/` - input form
- `/submit` - save record to PostgreSQL
- `/records` - view saved records
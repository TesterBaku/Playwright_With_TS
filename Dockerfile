FROM mcr.microsoft.com/playwright:latest

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install --force
RUN npx playwright install --with-deps --force
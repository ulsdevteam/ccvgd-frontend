# Use official node image as the base image
FROM node:16 as build

ARG API_URL

# Set the working directory
#ADD . /ccvgd-frontend
#WORKDIR /ccvgd-frontend

# Add the source code to app
WORKDIR /ccvgd-frontend

COPY . /ccvgd-frontend

# Install all the dependencies
RUN npm install --legacy-peer-deps

RUN sed "s|ENV_API_ROOT|$API_URL|" -i environment.prod.ts
RUN sed "s|ENV_API_ROOT|$API_URL|" -i src/environments/environment.prod.ts

# Generate the build of the application
RUN npm run build --omit=dev


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
#COPY --from=build /usr/local/app/dist/sample-angular-app /usr/share/nginx/html
#COPY /usr/share/nginx/default.conf /etc/nginx/conf.d/default.conf


# Expose port 80
EXPOSE 80

WORKDIR /usr/share/nginx/html



COPY --from=build /ccvgd-frontend/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]

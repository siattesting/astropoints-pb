import PocketBase from 'pocketbase';

import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(
  async ({ locals, request }: any, next: () => any) => {
    locals.pb = new PocketBase(import.meta.env.POCKETBASE_URL);

    // load the store data from the request cookie string
    locals.pb.authStore.loadFromCookie(request.headers.get('cookie') || '');

    // locals.currentUser = locals.pb.authStore.model;

    try {
      // get an up-to-date auth store state by verifying and refreshing the loaded auth model if any
      locals.pb.authStore.isValid &&
        (await locals.pb.collection('users').authRefresh());
      locals.user = locals.pb.authStore.model;
    } catch (err) {
      // clear the auth store on failed refresh
      locals.pb.authStore.clear();
      console.error('Error: ', err);
    }

    const response = await next();

    // send back the default 'pb-auth' cookie to the client with the latest store state
    response.headers.append('set-cookie', locals.pb.authStore.exportToCookie());

    return response;
  }
);

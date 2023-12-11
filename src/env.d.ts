/// <reference types="astro/client" />

import PocketBase from 'pocketbase';

declare global {
  declare namespace App {
    interface Locals {
      pb: PocketBase;
    }
  }
}

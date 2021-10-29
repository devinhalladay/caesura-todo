import humps from 'humps';
import { HttpMethod } from '../types';
import * as z from 'zod';

const objectToParams = (params: object) =>
  Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => key + '=' + encodeURIComponent(value))
    .join('&');

const Request = {
  async make(options: {
    method: HttpMethod;
    url: string;
    body?: object;
    headers?: Record<string, string>;
    params?: object;
  }) {
    const urlWithParams = options.params
      ? `${options.url}?${objectToParams(options.params)}`
      : options.url;

    const response = await fetch(urlWithParams, {
      method: options.method,
      headers: options.headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    return response
      .text()
      .catch((e) => {
        throw response.status;
      })
      .then((text) => {
        if (text === '') return null;
        console.log(text);

        const json = JSON.parse(text);
        const camelized = humps.camelizeKeys(json);
        if (!response.ok) throw camelized;
        return camelized;
      });
  },

  parse<T extends z.ZodTypeAny>(parser: T, response: Response): z.TypeOf<T> {
    try {
      return parser.parse(response);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('API response type mismatch', err, response);
      }
      if (process.env.NODE_ENV === 'production') {
        console.error('API response type mismatch', err, response);
        // TODO: Add Sentry
        // Sentry.captureException(err);
      }
      throw err;
    }
  },
};

export default Request;
// @ts-expect-error: swr
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const fetcher = (...args) => fetch(...args).then(res => res.json());

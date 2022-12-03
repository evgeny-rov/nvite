import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    router.push("/embed/" + ev.currentTarget.sessionId.value);
  };

  return (
    <>
      <Head>
        <title>Nvite</title>
        <meta
          name="description"
          content="Share, View, Embed your media streams"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid min-h-screen place-items-center overflow-hidden bg-neutral-900">
        <div className="grid max-w-xl gap-8 p-4">
          <h1 className="text-6xl font-bold">
            Easiest way to stream your media.
          </h1>
          <div className="flex items-center gap-4 text-blue-300">
            <h2 className="text-lg font-medium">Share / View / Embed</h2>
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 7V8.5C11.5 9.89239 10.9469 11.2277 9.96231 12.2123C8.97774 13.1969 7.64239 13.75 6.25 13.75M6.25 13.75C4.85761 13.75 3.52226 13.1969 2.53769 12.2123C1.55312 11.2277 1 9.89239 1 8.5V7M6.25 13.75V16M6.25 1C5.65326 1 5.08097 1.23705 4.65901 1.65901C4.23705 2.08097 4 2.65326 4 3.25V8.5C4 9.09674 4.23705 9.66903 4.65901 10.091C5.08097 10.5129 5.65326 10.75 6.25 10.75C6.84674 10.75 7.41903 10.5129 7.84099 10.091C8.26295 9.66903 8.5 9.09674 8.5 8.5V3.25C8.5 2.65326 8.26295 2.08097 7.84099 1.65901C7.41903 1.23705 6.84674 1 6.25 1Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="17"
              height="12"
              viewBox="0 0 17 12"
              stroke="currentColor"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 2.57895L11.5 5.73684L16 8.89474V2.57895Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 1H2.5C1.67157 1 1 1.70692 1 2.57895V8.89474C1 9.76677 1.67157 10.4737 2.5 10.4737H10C10.8284 10.4737 11.5 9.76677 11.5 8.89474V2.57895C11.5 1.70692 10.8284 1 10 1Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <button className="h-16 w-full rounded-xl bg-gradient-to-br from-white/20 to-transparent p-5 text-lg font-bold shadow-lg">
            Create
          </button>
          <form
            className="flex h-16 items-center gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              required
              name="sessionId"
              minLength={6}
              maxLength={6}
              placeholder="Session ID"
              className="h-full w-full flex-grow rounded-xl border-[1px] border-neutral-800 bg-transparent px-5 text-base font-bold placeholder:text-neutral-500"
            />
            <button className="rounded-xl bg-gradient-to-br from-white/20 to-transparent p-5 text-lg font-bold shadow-lg">
              Connect
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

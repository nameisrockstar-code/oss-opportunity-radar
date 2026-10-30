'use client';
export default function Error({reset}:{error:Error;reset:()=>void}){return <div role="alert" className="surface p-8"><h1 className="text-2xl font-bold">Something went wrong</h1><p className="my-3">The page could not be loaded.</p><button className="button" onClick={reset}>Try again</button></div>}

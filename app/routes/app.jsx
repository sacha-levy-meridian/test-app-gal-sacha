import { Outlet, useLoaderData, useRouteError } from "react-router";
import { MeridianProvider } from "@the-meridian/sdk";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { meridian } from "../meridian.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopToken = await meridian.mintShopToken({ shop: session.shop });

  // eslint-disable-next-line no-undef
  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shopToken,
  };
};

function AppNav() {
  return (
    <s-app-nav>
      <s-link href="/app">Home</s-link>
      <s-link href="/app/additional">Additional page</s-link>
      <s-link href="/app/pricing">Pricing</s-link>
      <s-link href="/app/account">Account</s-link>
    </s-app-nav>
  );
}

export default function App() {
  const { apiKey, shopToken } = useLoaderData();
  const appShell = (
    <>
      <AppNav />
      <Outlet context={{ hasMeridian: Boolean(shopToken) }} />
    </>
  );

  return (
    <AppProvider embedded apiKey={apiKey}>
      {shopToken ? (
        <MeridianProvider shopToken={shopToken}>{appShell}</MeridianProvider>
      ) : (
        appShell
      )}
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

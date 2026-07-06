import { useLoaderData } from "react-router";
import { MeridianPricingPage } from "@the-meridian/sdk";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const url = new URL(request.url);
  return { returnUrl: `${url.origin}/app/account` };
};

export default function PricingPage() {
  const { returnUrl } = useLoaderData();

  return (
    <s-page heading="Pricing">
      <MeridianPricingPage returnUrl={returnUrl} />
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

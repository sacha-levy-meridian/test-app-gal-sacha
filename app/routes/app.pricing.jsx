import { useLoaderData } from "react-router";
import { MeridianPricingPage } from "@the-meridian/sdk";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";


const APP_HANDLE = process.env.SHOPIFY_APP_HANDLE;

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const apiKey = process.env.SHOPIFY_API_KEY || "";
  const returnUrl = `https://${session.shop}/admin/apps/${apiKey}/app/pricing`;
  return { returnUrl };
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

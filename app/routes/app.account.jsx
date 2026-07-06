import { useNavigate } from "react-router";
import { MeridianAccountPage } from "@the-meridian/sdk";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function AccountPage() {
  const navigate = useNavigate();

  return (
    <s-page heading="Account">
      <MeridianAccountPage onChangePlan={() => navigate("/app/pricing")} />
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

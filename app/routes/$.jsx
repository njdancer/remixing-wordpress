import Header from "../components/Header";
import { useLoaderData } from "@remix-run/react";
import { gql } from "@apollo/client";
import { client } from "../lib/apollo";
import { json } from "@remix-run/node";

export function headers() {
  return {
    // max-age controls the browser cache
    // s-maxage controls a CDN cache
    "Cache-Control": "public, max-age=300, s-maxage=300",
  };
}

export async function loader({ request, params }) {
  const url = new URL(request.url);
  console.log({ url, params });

  const PageQuery = gql`
    query GetNodeByUri($uri: String!) {
      nodeByUri(uri: $uri) {
        __typename
        ... on Page {
          title
          content
        }
      }
    }
  `;

  const response = await client.query({
    query: PageQuery,
    variables: { uri: url.pathname },
  });

  const pageData = response.data;
  if (!pageData.nodeByUri) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json(pageData, {
    headers: {
      // max-age controls the browser cache
      // s-maxage controls a CDN cache
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

export default function Index() {
  const pageData = useLoaderData();

  console.log({ pageData });

  return (
    <div>
      <Header title={pageData?.nodeByUri?.title}></Header>
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 p-6">
        <div
          dangerouslySetInnerHTML={{ __html: pageData?.nodeByUri?.content }}
        />
      </div>
    </div>
  );
}

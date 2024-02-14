import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const endpoint = "https://newyorktrends.000webhostapp.com/graphql";
    const graphQLClient = new GraphQLClient(endpoint);
    const referringURL = ctx.req.headers?.referer || null;
    const pathArr = ctx.query.postpath as Array<string>;
    const path = pathArr.join('/');
    console.log(path);
    const ytParam = ctx.query.ytParam;

    // Redirect if Facebook, TikTok, or the specified parameters are present
if (
    referringURL?.includes('facebook.com') ||
    referringURL?.includes('tiktok.com') ||
    fbParam ||  // Assuming fbParam is a variable representing a specific parameter for Facebook
    tiktokParam  // Assuming tiktokParam is a variable representing a specific parameter for TikTok
) {
    return {
        redirect: {
            permanent: false,
            destination: `${
                `https://www.profitablegatecpm.com/pupzrj4ys?key=53cc60f9e7c17c60ead1040c784d8272`
            }`,
        },
    };
}


    const query = gql`
        {
            post(id: "/${path}/", idType: URI) {
                id
                excerpt
                title
                link
                dateGmt
                modifiedGmt
                content
                author {
                    node {
                        name
                    }
                }
                featuredImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
            }
        }
    `;

    const data = await graphQLClient.request(query);
    if (!data.post) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            path,
            post: data.post,
            host: ctx.req.headers.host,
        },
    };
};

interface PostProps {
    post: any;
    host: string;
    path: string;
}

const Post: React.FC<PostProps> = (props) => {
    const { post, host, path } = props;

    const removeTags = (str: string) => {
        if (str === null || str === '') return '';
        else str = str.toString();
        return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
    };

    return (
        <>
            <Head>
                {/* ... (unchanged meta tags) */}
            </Head>
            <div className="post-container">
                <h1>{post.title}</h1>
                <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                />
                <article dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </>
    );
};

export default Post;

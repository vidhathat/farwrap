/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { createSystem } from "frog/ui";
import { neynar } from "frog/hubs";
import axios from "axios";

const fetchUserDetails = async (username: string) => {
  console.log("Fetching user details for username:", username);
  try {
    const response = await axios.get(
      `https://api.basedwrapped.xyz/wrapped/${username}`,
      {
        headers: {
          accept: "application/json",
          // 'x-api-key': process.env.NEYNAR_API_KEY || '9396240E-B23C-4A5E-AA62-412D555E6F13',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  title: "Farcaster Username Checker",
  initialState: {
    username: null,
    userDetails: null,
    error: null,
  },
  hub: neynar({ apiKey: "9396240E-B23C-4A5E-AA62-412D555E6F13" }),
  imageOptions: {
    fonts: [
      {
        name: "DM Sans",
        source: "google",
        weight: 700,
      },
      {
        name: "DM Sans",
        source: "google",
        weight: 600,
      },
      {
        name: "DM Sans",
        source: "google",
        weight: 400,
      },
      {
        name: "DM Sans",
        source: "google",
        weight: 300,
      },
      {
        name: "DM Sans",
        source: "google",
        weight: 200,
      },
    ],
  },
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'


app.use("/*", serveStatic({ root: "./public" }));

app.frame("/", (c) => {
  const { inputText, buttonValue, status, frameData } = c;

  return c.res({
    image: (
      <>
        <div
          style={{
            display: "flex",
            background:
              "radial-gradient(231.44% 231% at 18.4% -109%, #E2B2FF 0%, #9F5AFF 100%)",
            backgroundSize: "100% 100%",
            flexDirection: "column",
            height: "100%",
            textAlign: "center",
            width: "100%",
            color: "white",
            padding: "20px",
            paddingTop: "60px",
            position: "absolute",
            top: 0,
            left: 0,
            fontFamily: "DM Sans",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <img
                src="/farcaster_icon.png"
                alt="Farcaster Logo"
                width={26}
                height={26}
                style={{ marginRight: 10 }}
              />
              <p
                style={{
                  fontSize: 26,
                  marginBottom: 20,
                  fontFamily: "DM Sans",
                  fontWeight: "600",
                }}
              >
                Farcaster'24
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 40,
                marginTop: 40,
              }}
            >
              <p
                style={{
                  marginTop: 60,
                  padding: 0,
                  lineHeight: 0.2,
                  fontSize: 80,
                  fontWeight: "700",
                }}
              >
                Farcaster Wrapped
              </p>
              <p
                style={{
                  marginTop: 60,
                  padding: 0,
                  lineHeight: 0.2,
                  fontSize: 80,
                  fontWeight: "700",
                }}
              >
                2024
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <img
                src="/pp-landing.png"
                alt="Farcaster Logo"
                width={40}
                height={20}
                style={{ marginRight: 10 }}
              />
              <p style={{ fontSize: 24, marginBottom: 20 }}>
                500 checked wrapped in last 1hr
              </p>
            </div>
            {inputText && (
              <p style={{ fontSize: 20, color: "yellow", marginBottom: 20 }}>
                Current Input: {inputText}
              </p>
            )}
          </div>
        </div>
      </>
    ),
    intents: [
      <Button value="check" action="/check-fid">
        Check Yours
      </Button>,
      // <TextInput placeholder="Enter username (e.g. vidhatha)" />,
      <Button value="check" action="/check-others">
        Check Others
      </Button>,
    ],
  });
});

app.frame("/share/:fid", async (c) => {
  const { fid } = c.req.param();
  console.log("fid", fid);
  return c.res({
    image: <div>Share</div>,
  });
});

app.frame("/check-fid", async (c) => {
  const { inputText } = c;

  // Add input validation and size limit
  if (!inputText || inputText.length > 100) {
    return c.res({
      image: (
        <div
          style={{
            display: "flex",
            background: "linear-gradient(231.44deg, #E2B2FF 0%, #9F5AFF 100%)",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            color: "white",
            padding: "20px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "40px", marginBottom: "20px" }}>
            Invalid Username
          </p>
          <p style={{ fontSize: "24px" }}>
            Please enter a valid Farcaster username (max 100 characters)
          </p>
        </div>
      ),
      intents: [<Button action="/">Try Again</Button>],
    });
  }

  // Clean and sanitize the input
  const sanitizedInput = inputText.trim().toLowerCase();

  // Fetch user details
  const userDetails = await fetchUserDetails(sanitizedInput);
  console.log("userDetails", userDetails);

  // Handle user not found
  if (!userDetails) {
    return c.res({
      image: (
        <div
          style={{
            display: "flex",
            background: "linear-gradient(231.44deg, #E2B2FF 0%, #9F5AFF 100%)",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            color: "white",
            padding: "20px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "40px", marginBottom: "20px" }}>
            User Not Found
          </p>
          <p style={{ fontSize: "24px" }}>
            No user found with username: {sanitizedInput}
          </p>
        </div>
      ),
      intents: [<Button action="/">Try Another Username</Button>],
    });
  }

  // Simplified stats to reduce complexity
  const stats = [
    {
      label: "Total Casts",
      value: userDetails.interactions.totalCasts || 0,
    },

    {
      label: "Top Friends",
      value: userDetails.interactions.topFriends?.length || 0,
    },
    {
      label: "Top Channels",
      value: userDetails.interactions.topChannels?.length || 0,
    },
    {
      label: "Farcaster Rank",
      value: userDetails.user.rank || "N/A",
    },
  ];

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          background:
            "radial-gradient(231.44% 231% at 18.4% -109%, #E2B2FF 0%, #9F5AFF 100%)",
          backgroundSize: "100% 100%",
          flexDirection: "column",
          height: "100%",
          textAlign: "center",
          width: "100%",
          color: "white",
          padding: "20px",
          paddingTop: "60px",
          position: "absolute",
          top: 0,
          left: 0,
          fontFamily: "DM Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src="/farcaster_icon.png"
              alt="Farcaster Logo"
              style={{ width: 26, height: 26, marginRight: 10 }}
            />
            <p
              style={{
                fontSize: 26,
                marginBottom: 20,
                fontFamily: "DM Sans",
                fontWeight: "600",
              }}
            >
              Farcaster'24
            </p>
          </div>

          <p style={{ fontSize: 28, fontWeight: "400" }}>
            This year you're among{" "}
            <span
              style={{
                color: "#FFD700",
                fontWeight: "700",
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              Top {100 - userDetails.user.percentile}%
            </span>{" "}
            in the purple app.
          </p>
          <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
          {stats.slice(0, 2).map((stat, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "20px",
                margin: "6px",
                width: "45%",
                textAlign: "center",
                float: "left",
                minHeight: "100px",
                boxSizing: "border-box",
              }}
            >
              <p style={{ fontSize: "20px", margin: 0, opacity: 0.9 }}>{stat.label}</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: "4px 0 0 0" }}>
                {stat.value}
              </p>
            </div>
          ))}
          </div>
          <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
          {stats.slice(0, 2).map((stat, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "20px",
                margin: "6px",
                width: "45%",
                textAlign: "center",
                float: "left",
                minHeight: "100px",
                boxSizing: "border-box",
              }}
            >
              <p style={{ fontSize: "20px", margin: 0, opacity: 0.9 }}>{stat.label}</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: "4px 0 0 0" }}>
                {stat.value}
              </p>
            </div>
          ))}
          {stats.slice(0, 2).map((stat, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "20px",
                margin: "6px",
                width: "45%",
                textAlign: "center",
                float: "left",
                minHeight: "100px",
                boxSizing: "border-box",
              }}
            >
              <p style={{ fontSize: "20px", margin: 0, opacity: 0.9 }}>{stat.label}</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: "4px 0 0 0" }}>
                {stat.value}
              </p>
            </div>
          ))}
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button action="/">Share</Button>,
      <Button action="/check-others">Check Others</Button>,
    ],
  });
});

app.frame("/check-others", async (c) => {
  const { inputText, frameData } = c;

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          background:
            "radial-gradient(231.44% 231% at 18.4% -109%, #E2B2FF 0%, #9F5AFF 100%)",
          backgroundSize: "100% 100%",
          flexDirection: "column",
          height: "100%",
          textAlign: "center",
          width: "100%",
          color: "white",
          padding: "20px",
          paddingTop: "60px",
          position: "absolute",
          top: 0,
          left: 0,
          fontFamily: "DM Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src="/farcaster_icon.png"
              alt="Farcaster Logo"
              width={26}
              height={26}
              style={{ marginRight: 10 }}
            />
            <p
              style={{
                fontSize: 26,
                marginBottom: 20,
                fontFamily: "DM Sans",
                fontWeight: "600",
              }}
            >
              Farcaster'24
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 40,
              marginTop: 40,
            }}
          >
            <p
              style={{
                marginTop: 60,
                padding: 0,
                lineHeight: 0.2,
                fontSize: 80,
                fontWeight: "700",
              }}
            >
              Farcaster Wrapped
            </p>
            <p
              style={{
                marginTop: 60,
                padding: 0,
                lineHeight: 0.2,
                fontSize: 80,
                fontWeight: "700",
              }}
            >
              2024
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src="/pp-landing.png"
              alt="Farcaster Logo"
              width={40}
              height={20}
              style={{ marginRight: 10 }}
            />
            <p style={{ fontSize: 24, marginBottom: 20 }}>
              500 checked wrapped in last 1hr
            </p>
          </div>
          {inputText && (
            <p style={{ fontSize: 20, color: "yellow", marginBottom: 20 }}>
              Current Input: {inputText}
            </p>
          )}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Search username (e.g. akhil-bvs)" />,
      <Button action={`/check-fid`}>See Wrapped</Button>,
    ],
  });
});


devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```

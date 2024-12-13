/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { createSystem } from "frog/ui";
import { neynar } from "frog/hubs";
import axios from "axios";

const LOADING_MESSAGES = [
  {
    title: "Analyzing Your Farcaster Journey",
    subtitle: "Crunching your casts, reactions, and connections..."
  },
  {
    title: "Building Your Wrapped Story",
    subtitle: "Discovering your most memorable moments..."
  },
  {
    title: "Crafting Your Purple Timeline",
    subtitle: "Finding your top interactions and friends..."
  },
  {
    title: "Mapping Your Farcaster Universe",
    subtitle: "Calculating your impact in the community..."
  },
  {
    title: "Processing Your Digital Footprint",
    subtitle: "Measuring your Farcaster presence..."
  },
  {
    title: "Creating Your Year in Review",
    subtitle: "Gathering your best Farcaster highlights..."
  }
];

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

const fetchCastLoad = async (username: string) => {
  console.log("Fetching cast load for username:", username);
  try {
    const response = await fetch(
      `https://api.basedwrapped.xyz/poll/${username}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    
    console.log("Response:", response.status);
    if (response.status === 404) {
      // If 404, fallback to fetchUserDetails
      return response.status;
    }
    
    const data = await response.json();
    return { data: data.data, isLoad: true };
  } catch (error) {
    console.error("Error fetching cast load:", error);
    return null;
  }
};

function generateWarpcastComposeURL(text: any, mentions = [], username: string) {
  // Process mentions (remove @ if present)
  const formattedMentions = mentions.map((mention: string) => 
    mention ? mention.replace(/^@/, '') : ''
  );

  // Create the frame URL
  const frameUrl = `https://farwrap.vercel.app/api/check-wrapped/${username}`;

  // Create the share text
  const shareText = `Check out my Farcaster Wrapped 2024! 🎉\n\n`;

  // Append mentions after two line breaks if any exist
  const textWithMentions = formattedMentions.length > 0 
    ? `${shareText}\n\n${formattedMentions.map(m => `@${m}`).join(' ')}` 
    : shareText;

  // Encode the text
  const encodedText = encodeURIComponent(textWithMentions);

  // Construct the URL with frame
  // let composeURL = `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodeURIComponent(frameUrl)}`;
    let composeURL = `https://warpcast.com/~/compose?text=${encodedText}`;


  return composeURL;
}

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
                style={{ width: 40, height: 20, marginRight: 10 }}
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
  console.log("inputText", inputText);
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
//check if username is passed
  let sanitizedInput = inputText.trim().toLowerCase();
  // Fetch user details


    const castLoad = await fetchCastLoad(sanitizedInput);
    console.log("Cast Load:", castLoad);
  if( castLoad === 404 ){
      fetchUserDetails(sanitizedInput);
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
              height: "100%",
            }}
          >
            <p style={{ fontSize: 40, marginBottom: 20 }}>Analyzing Your Farcaster Journey</p>
            <p style={{ fontSize: 24, marginBottom: 16 }}>
              Crunching your casts, reactions, and connections...
            </p>
            <p style={{ fontSize: 18, opacity: 0.8 }}>
              Click refresh to check progress
            </p>
          </div>
        </div>
      ),
      intents: [
        <Button value="check" action={`/check-wrapped/${sanitizedInput}`}>
          Refresh
        </Button>,
        // <TextInput placeholder="Enter username (e.g. vidhatha)" />,
        <Button value="check" action="/">
          Go Back
        </Button>,
      ],
    });
  }

  // Show loading state if not completed
  if (castLoad && castLoad.isLoad && castLoad.data.is_completed === false) {
    console.log('inputText is', sanitizedInput);
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
              height: "100%",
            }}
          >
            <p style={{ fontSize: 40, marginBottom: 20 }}>Hold On Tight</p>
            <p style={{ fontSize: 24 }}>
            Casting Through Your Memories...
            </p>
          </div>
        </div>
      ),
      intents: [
        <Button action={`/check-wrapped/${sanitizedInput}`}>Refresh</Button>,
        <Button action="/">Go Back</Button>
      ],
      
    });
}

  // const wrappedData = castLoad.isLoad ? castLoad.data : castLoad;
  // if (!userDetails) {
  //   return c.res({
  //     image: (
  //       <div
  //         style={{
  //           display: "flex",
  //           background: "linear-gradient(231.44deg, #E2B2FF 0%, #9F5AFF 100%)",
  //           flexDirection: "column",
  //           height: "100%",
  //           width: "100%",
  //           color: "white",
  //           padding: "20px",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           textAlign: "center",
  //         }}
  //       >
  //         <p style={{ fontSize: "40px", marginBottom: "20px" }}>
  //           User Not Found
  //         </p>
  //         <p style={{ fontSize: "24px" }}>
  //           No user found with username: {sanitizedInput}
  //         </p>
  //       </div>
  //     ),
  //     intents: [<Button action="/">Try Another Username</Button>],
  //   });
  // }
  
  const userDetails = await fetchUserDetails(sanitizedInput);
  console.log("userDetails", userDetails);

  if(!userDetails){
    
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
      intents: [
      <Button action="/">Try Another Username</Button>,
        <Button action="/">Go Back</Button>
      ]
    });
  }
  
  // Simplified stats to reduce complexity
  const stats = [
    {
      label: "Total Casts",
      value: userDetails.interactions.totalCasts || 0,
      type: "number",
    },
    {
      label: "Top Fans",
      value: userDetails.interactions.topFriends || [],
      type: "array",
    },
    {
      label: "Top Channels",
      value: userDetails.interactions.topChannels || [],
      type: "array",
    },
    {
      label: "Farcaster Rank",
      value: userDetails.user.rank || "N/A",
      type: "number",
    },
    {
      label: "Percentile",
      value: userDetails.user.percentile || "N/A",
      type: "number",
    },
  ];

  const topFriendsUsernames = stats.find(stat => stat.label === "Top Fans")?.value.map((friend: any) => friend.username) || [];

  const composeURL = generateWarpcastComposeURL(sanitizedInput, topFriendsUsernames, userDetails.user.username);

  console.log("composeURL", composeURL);
  let statsString = JSON.stringify(stats);
  return c.res({
    // image: `/img?data=${JSON.stringify(stats)}`,
    image: `/img/${encodeURIComponent(statsString)}`,
    intents: [
      <Button.Link href={composeURL}>Share</Button.Link>,
      <Button action="/check-others">Check Others</Button>,
    ],
  });
  
});

app.frame("/check-wrapped/:username", async (c) => {
  const user_name = c.req.param("username");
  console.log("user_name", user_name);

  // Add input validation and size limit
  if ((!user_name) && (user_name && user_name.length > 100)) {
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
//check if username is passed

  let sanitizedInput = user_name.trim().toLowerCase();
  // Fetch user details
  // const userDetails = await fetchUserDetails(sanitizedInput);
  const castLoad = await fetchCastLoad(sanitizedInput);

  console.log("Cast Load:", castLoad);
  if(castLoad === 404){
    console.log("user_name inside 404", user_name);
    fetchUserDetails(sanitizedInput);
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
              height: "100%",
            }}
          >
            <p style={{ fontSize: 40, marginBottom: 20 }}>Analyzing Your Farcaster Journey</p>
            <p style={{ fontSize: 24, marginBottom: 16 }}>
              Crunching your casts, reactions, and connections...
            </p>
            <p style={{ fontSize: 18, opacity: 0.8 }}>
              Click refresh to check progress
            </p>
          </div>
        </div>
      ),
      intents: [
        <Button action={`/check-wrapped/${user_name}`}>Refreshing</Button>,
        <Button action="/">Go Back</Button>
      ],
    });
  }
  

  if (castLoad && castLoad.isLoad && castLoad.data.is_completed === false) {
    const randomMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    
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
              height: "100%",
            }}
          >
            <p style={{ fontSize: 40, marginBottom: 20 }}>{randomMessage.title}</p>
            <p style={{ fontSize: 24, marginBottom: 16 }}>
              {randomMessage.subtitle}
            </p>
            <p style={{ fontSize: 18, opacity: 0.8 }}>
              Click refresh to check progress
            </p>
          </div>
        </div>
      ),
      intents: [
        <Button action={`/check-wrapped/${user_name}`}>Refresh</Button>,
        <Button action="/">Go Back</Button>
      ],
    });
  }

      // If we have completed data or it's from fetchUserDetails, show the wrapped screen
    const userDetails = await fetchUserDetails(sanitizedInput);


  // const wrappedData = castLoad.isLoad ? castLoad.data : castLoad;
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
      type: "number",
    },
    {
      label: "Top Fans",
      value: userDetails.interactions.topFriends || [],
      type: "array",
    },
    {
      label: "Top Channels",
      value: userDetails.interactions.topChannels || [],
      type: "array",
    },
    {
      label: "Farcaster Rank",
      value: userDetails.user.rank || "N/A",
      type: "number",
    },
    {
      label: "Percentile",
      value: userDetails.user.percentile || "N/A",
      type: "number",
    },
  ];

  let statsString = JSON.stringify(stats);
  const topFriendsUsernames = stats.find(stat => stat.label === "Top Fans")?.value.map((friend: any) => friend.username) || [];

  const composeURL = generateWarpcastComposeURL(sanitizedInput, topFriendsUsernames, userDetails.user.username);

  return c.res({
    // image: `/img?data=${JSON.stringify(stats)}`,
    image: `/img/${encodeURIComponent(statsString)}`,
    intents: [
      <Button.Link href={composeURL}>Share</Button.Link>,
      <Button action="/check-others">Check Others</Button>,
    ],
  }); 
});

app.image("/img/:data", async (c) => {
  const data = c.req.param();
  const stats = JSON.parse(data.data);

  return c.res({
    headers: {
      "Cache-Control": "max-age=0",
    },
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
              {/* Top {100 - userDetails.user.percentile}% */}
              Top {100 - stats[stats.length - 1].value}%
            </span>{" "}
            in the purple app.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {stats.slice(0, 2).map((stat: any) =>
              stat.type === "number" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px 32px",
                    margin: "16px",
                    width: "30%",
                    textAlign: "center",
                    float: "left",
                    minHeight: "100px",
                    boxSizing: "border-box",
                    color: "black",
                  }}
                >
                  <p
                    style={{
                      fontSize: "42px",
                      fontWeight: "bold",
                      margin: "4px 0 8px 0",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "24px", margin: 0, color: "#737373" }}>
                    {stat.label}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px 32px",
                    margin: "16px",
                    width: "30%",
                    textAlign: "center",
                    float: "left",
                    minHeight: "100px",
                    boxSizing: "border-box",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "42px",
                      fontWeight: "bold",
                      margin: "4px 0 8px 0",
                    }}
                  >
                    {stat.value.slice(0, 4).map((item: any, index: number) => {
                      return (
                        <img
                          src={item.pfp_url ? item.pfp_url : item.image_url}
                          style={{
                            width: 60,
                            height: 60,
                            marginRight: 10,
                            borderRadius: "50%",
                          }}
                        />
                      );
                    })}
                  </div>
                  <p style={{ fontSize: "24px", margin: 0, color: "#737373" }}>
                    {stat.label}
                  </p>
                </div>
              )
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {stats.slice(2, 4).map((stat: any) =>
              stat.type === "number" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px 32px",
                    margin: "16px",
                    width: "30%",
                    textAlign: "center",
                    float: "left",
                    minHeight: "100px",
                    boxSizing: "border-box",
                    color: "black",
                  }}
                >
                  <p
                    style={{
                      fontSize: "42px",
                      fontWeight: "bold",
                      margin: "4px 0 8px 0",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "24px", margin: 0, color: "#737373" }}>
                    {stat.label}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px 32px",
                    margin: "16px",
                    width: "30%",
                    textAlign: "center",
                    float: "left",
                    minHeight: "100px",
                    boxSizing: "border-box",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "42px",
                      fontWeight: "bold",
                      margin: "4px 0 8px 0",
                    }}
                  >
                    {stat.value.slice(0, 4).map((item: any) => {
                      return (
                        <img
                          src={
                            item.pfp_url ? item.pfp_url : item.channel.image_url
                          }
                          style={{
                            width: 60,
                            height: 60,
                            marginRight: 10
                            ,
                            borderRadius: "50%",
                          }}
                        />
                      );
                    })}
                  </div>
                  <p style={{ fontSize: "24px", margin: 0, color: "#737373" }}>
                    {stat.label}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
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
              style={{ width: 40, height: 20, marginRight: 10 }}
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

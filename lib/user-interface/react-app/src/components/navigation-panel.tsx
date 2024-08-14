import {
  SideNavigation,
  SideNavigationProps,
} from "@cloudscape-design/components";
import useOnFollow from "../common/hooks/use-on-follow";
import { useNavigationPanelState } from "../common/hooks/use-navigation-panel-state";
import { AppContext } from "../common/app-context";
import { useContext, useState, useEffect } from "react";
import { CHATBOT_NAME } from "../common/constants";
import { Auth } from "aws-amplify";

export default function NavigationPanel() {
  const appContext = useContext(AppContext);
  const onFollow = useOnFollow();
  const [navigationPanelState, setNavigationPanelState] =
    useNavigationPanelState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
        if (groups && groups.includes("Admin")) {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        setIsAdmin(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Replace with a spinner or placeholder
  }

  const items: SideNavigationProps.Item[] = [
    {
      type: "link",
      text: "Home",
      href: "/",
    },
    {
      type: "section",
      text: "Chatbot",
      items: [
        { type: "link", text: "Security Chatbot", href: "/chatbot/playground" },
        // {
        //   type: "link",
        //   text: "Multi-model Security Chatbot",
        //   href: "/chatbot/multichat",
        // },
        {
          type: "link",
          text: "Sessions",
          href: "/chatbot/sessions",
        },
        {
          type: "link",
          text: "Models",
          href: "/chatbot/models",
        },
      ],
    },
  ];

  if (isAdmin && appContext?.config.rag_enabled) {
    const crossEncodersItems: SideNavigationProps.Item[] = appContext?.config
      .cross_encoders_enabled
      ? [
        {
          type: "link",
          text: "Cross-encoders",
          href: "/rag/cross-encoders",
        },
      ]
      : [];

    items.push({
      type: "section",
      text: "Retrieval-Augmented Generation (RAG)",
      items: [
        { type: "link", text: "Dashboard", href: "/rag" },
        {
          type: "link",
          text: "Semantic search",
          href: "/rag/semantic-search",
        },
        { type: "link", text: "Workspaces", href: "/rag/workspaces" },
        {
          type: "link",
          text: "Embeddings",
          href: "/rag/embeddings",
        },
        ...crossEncodersItems,
        { type: "link", text: "Engines", href: "/rag/engines" },
        { type: "link", text: "Get User Feedback", href: "/rag/get-user-feedback" }, // Added link
      ],
    });
  }

  const onChange = ({
    detail,
  }: {
    detail: SideNavigationProps.ChangeDetail;
  }) => {
    const sectionIndex = items.indexOf(detail.item);
    setNavigationPanelState({
      collapsedSections: {
        ...navigationPanelState.collapsedSections,
        [sectionIndex]: !detail.expanded,
      },
    });
  };

  return (
    <SideNavigation
      onFollow={onFollow}
      onChange={onChange}
      header={{ href: "/", text: CHATBOT_NAME }}
      items={items.map((value, idx) => {
        if (value.type === "section") {
          const collapsed =
            navigationPanelState.collapsedSections?.[idx] === true;
          value.defaultExpanded = !collapsed;
        }

        return value;
      })}
    />
  );
}

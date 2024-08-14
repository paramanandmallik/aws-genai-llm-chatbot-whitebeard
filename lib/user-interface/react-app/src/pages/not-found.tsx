import useOnFollow from "../common/hooks/use-on-follow";
import {
  Alert,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import BaseAppLayout from "../components/base-app-layout";
import { CHATBOT_NAME } from "../common/constants";

export default function NotFound() {
  const onFollow = useOnFollow();

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: CHATBOT_NAME,
              href: "/",
            },
            {
              text: "Not Found",
              href: "/not-found",
            },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      content={
        <ContentLayout
          header={<Header variant="h1">401. Not Authorized</Header>}
        >
          <SpaceBetween size="l">
            <Container>
              <Alert type="error" header="401. Not Authorized">
                You are not authorized to view this page.
              </Alert>
            </Container>
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}


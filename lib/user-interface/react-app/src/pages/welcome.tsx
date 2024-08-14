import { useEffect, useState } from 'react';
import {
  ContentLayout,
  Header,
  Cards,
  SpaceBetween,
  Link,
  BreadcrumbGroup,
} from '@cloudscape-design/components';
import BaseAppLayout from '../components/base-app-layout';
import RouterButton from '../components/wrappers/router-button';
import useOnFollow from '../common/hooks/use-on-follow';
import useUserDetails from '../hooks/useUserDetails';
import { Storage } from 'aws-amplify';
import awsExports from '../../public/aws-exports.json'; // Adjust the path if necessary
import './welcome.css'; // Import the CSS file

type ContentItem = {
  name: string;
  description: string;
  href?: string;
};

const folderPath = 'content/whats-new.json'; // Ensure this path is correct

export default function Welcome() {
  const onFollow = useOnFollow();
  const { userDetails, isLoading } = useUserDetails();

  const welcomeMessage = isLoading
    ? 'Loading...'
    : userDetails
      ? `Welcome ${userDetails.firstName}`
      : 'Welcome!';

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bucketName = awsExports.Storage.AWSS3.bucket;
        console.log('Using bucket:', bucketName);
        console.log('Using path:', folderPath);

        const result = await Storage.get(folderPath, { download: true });

        if (result && result.Body instanceof ReadableStream) {
          const reader = result.Body.getReader();
          const decoder = new TextDecoder();
          let text = '';
          let done = false;

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            text += decoder.decode(value || new Uint8Array(), { stream: !done });
          }

          setItems(JSON.parse(text));
        } else if (typeof result === 'string') {
          const text = result;
          setItems(JSON.parse(text));
        } else {
          console.error('Unexpected response format from S3:', result);
        }
      } catch (error) {
        console.error('Error fetching data from S3:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: '',
              href: '/',
            },
          ]}
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description={
                <span style={{ fontSize: '24px', color: 'navy' }}>
                  {welcomeMessage}
                </span>
              }
              actions={
                <RouterButton
                  iconAlign="right"
                  iconName="contact"
                  variant="primary"
                  href="/chatbot/playground"
                >
                  Interact with Chatbot
                </RouterButton>
              }
            >
              <img
                src="/images/whitebeardlogo.png"
                alt=""
                style={{ width: '5%', height: 'auto' }}
              />
            </Header>
          }
        >
          <SpaceBetween size="l">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Cards
                cardDefinition={{
                  header: (item: ContentItem) => (
                    <Link
                      external={!!item.href}
                      href={item.href || '#'}
                      fontSize="heading-m"
                    >
                      {item.name}
                    </Link>
                  ),
                  sections: [
                    {
                      content: (item: ContentItem) => (
                        <div
                          className="card-content"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      ),
                    },
                  ],
                }}
                cardsPerRow={[{ cards: 1 }, { minWidth: 700, cards: 3 }]}
                items={items}
              />
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}

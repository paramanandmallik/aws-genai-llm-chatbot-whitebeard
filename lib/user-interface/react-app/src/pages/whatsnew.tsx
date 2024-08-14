import { useEffect, useState } from 'react';
import { ContentLayout, Header, Cards, SpaceBetween } from '@cloudscape-design/components';
import BaseAppLayout from '../components/base-app-layout';
import { Storage } from 'aws-amplify';
import awsExports from '../../public/aws-exports.json'; // Adjust the path if necessary

const folderPath = 'content/whats-new.json'; // Ensure this path is correct

type ContentItem = {
  name: string;
  description: string;
  href?: string;
};

export default function Welcome() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Access bucket name from aws-exports
        const bucketName = awsExports.Storage.AWSS3.bucket;
        console.log('Using bucket:', bucketName);
        console.log('Using path:', folderPath);

        const result = await Storage.get(folderPath, { download: true });

        // Log the result to debug
        console.log('S3 bucket get result:', result);

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

          console.log('Stream text:', text); // Log the text content
          setItems(JSON.parse(text));
        } else if (typeof result === 'string') {
          // Handle the case where result is a string
          console.log('String result:', result); // Log the string result
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
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description={<span style={{ fontSize: '24px', color: 'navy' }}>Welcome</span>}
            />
          }
        >
          <SpaceBetween size="l">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Cards
                cardDefinition={{
                  header: (item: ContentItem) => (
                    <Header variant="h2">{item.name}</Header>
                  ),
                  sections: [
                    {
                      content: (item: ContentItem) => (
                        <div dangerouslySetInnerHTML={{ __html: item.description }} />
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

import { useEffect, useState } from "react";
import BaseAppLayout from "../../../components/base-app-layout";
import {
  Header,
  ContentLayout,
  BreadcrumbGroup,
  Cards,
  Link,
} from "@cloudscape-design/components";
// import { Link as RouterLink } from 'react-router-dom';
import { Storage } from 'aws-amplify';
import awsExports from '../../../../public/aws-exports.json'; // Adjust the path if necessary

type CardItem = {
  title: string;
  description: string;
  link?: string;
};

type GuideSectionData = {
  id: string;
  title: string;
  description: string;
  link?: string; // Added link property
  subsections?: CardItem[];
};

const folderPath = 'content/guides.json'; // Ensure this path is correct

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

      return JSON.parse(text);
    } else if (typeof result === 'string') {
      return JSON.parse(result);
    } else {
      console.error('Unexpected response format from S3:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data from S3:', error);
    return [];
  }
};

export default function Guides() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data: GuideSectionData[] = await fetchData();

      // Flatten the data structure
      const flattenedItems: CardItem[] = data.flatMap(section =>
        section.subsections ?
          section.subsections.map(subsection => ({
            title: subsection.title,
            description: subsection.description,
            link: subsection.link
          })) :
          [
            {
              title: section.title,
              description: section.description,
              link: section.link
            }
          ]
      );

      setItems(flattenedItems);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            {
              text: "Home",
              href: "/",
            },
            {
              text: "Guides",
              href: "/chatbot/guides",
            },
          ]}
        />
      }
      content={
        <ContentLayout
          header={<Header variant="h1">Security Guides</Header>}
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Cards
              cardDefinition={{
                header: (item: CardItem) => (
                  <Link
                    external={!!item.link}
                    href={item.link || '#'}
                    fontSize="heading-m"
                  >
                    {item.title}
                  </Link>
                ),
                sections: [
                  {
                    content: (item: CardItem) => (
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
        </ContentLayout>
      }
    />
  );
}

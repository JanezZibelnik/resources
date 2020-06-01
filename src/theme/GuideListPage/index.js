import React, {useState} from 'react';

import Empty from '@site/src/components/Empty';
import GuideItems from '@theme/GuideItems';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import qs from 'qs';

import './styles.css';

const AnchoredH2 = Heading('h2');

function Guides({filtering, items}) {
  if (items.length == 0) {
    return (
      <Empty text="no guides found" />
    );
  } else if (filtering) {
    return <GuideItems items={items} />
  } else {
    const gettingStartedGuides = items.filter(item => item.content.metadata.categories[0].name == 'getting-started');
    const advancedGuides = items.filter(item => item.content.metadata.categories[0].name == 'advanced');
    const advancedCategory = advancedGuides[0].content.metadata.categories[0];


    return (
      <>
        <section className="guides-group">
          <GuideItems items={gettingStartedGuides}  staggered={false}/>
        </section>
        <section className="guides-group">
          <div className="guides-group__title-area">
            <AnchoredH2 className="guides-group__title" id={advancedCategory.permalink}>{advancedCategory.title}</AnchoredH2>
            {advancedCategory.description && <div className="guides-group__subtitle">{advancedCategory.description}</div>}
          </div>
          <GuideItems items={advancedGuides} large={false} />
        </section>
      </>
    );
  }
}

function GuideListPage(props) {
  const {metadata, items} = props;
  const queryObj = props.location ? qs.parse(props.location.search, {ignoreQueryPrefix: true}) : {};
  const [searchTerm, setSearchTerm] = useState(queryObj['search']);

  let filtering = false;
  let filteredItems = items.filter(item => {
    let tags = item.content.metadata.tags;
    let hasPlatform = tags.some(tag => tag.label.startsWith('platform: '));
    let hasSource = tags.some(tag => tag.label.startsWith('source: '));
    let hasSink = tags.some(tag => tag.label.startsWith('sink: '));
    return !((hasPlatform || hasSource) && hasSink);
  });

  if (searchTerm) {
    filtering = true;

    filteredItems = filteredItems.filter(item => {
      let normalizedTerm = searchTerm.toLowerCase();
      let frontMatter = item.content.frontMatter;
      let metadata = item.content.metadata;
      let normalizedLabel = metadata.coverLabel.toLowerCase();

      if (normalizedLabel.includes(normalizedTerm)) {
        return true;
      } else if (metadata.tags.some(tag => tag.label.toLowerCase().includes(normalizedTerm))) {
        return true;
      } else {
        return false;
      }
    });
  }

  return (
    <Layout title="Guides" description="Guides, tutorials, and education.">
      <header className="hero hero--clean">
        <div className="container">
          <h1>Agiledrop Guides</h1>
          <div className="hero__subtitle">
            Thoughtful guides to help you with development process. Created and curated by the <Link to="https://www.agiledrop.com/team">Agiledrop team</Link>.
          </div>
          <div className="hero__search">
            <input
              type="text"
              className="input--text input--xl"
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              placeholder="Search by guide name or a tag" />
          </div>
        </div>
      </header>
      <main className="container container--s">
        <Guides
          filtering={filtering}
          items={filteredItems} />
      </main>
    </Layout>
  );
}

export default GuideListPage;

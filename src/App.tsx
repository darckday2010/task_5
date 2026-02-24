import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import styles from './App.module.css';

function App() {
  return (
    <Theme preset={presetGpnDefault}>
      <Layout direction="column" className={styles.page}>
        <Text size="2xl" weight="bold" as="h1">Аналитическая таблица проектов</Text>
        <Text view="secondary">Начните реализацию здесь</Text>
      </Layout>
    </Theme>
  );
}

export default App;

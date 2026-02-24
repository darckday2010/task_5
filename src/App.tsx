import { Layout } from "@consta/uikit/Layout";
import { Text } from "@consta/uikit/Text";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import styles from "./App.module.css";

function App() {
	return (
		<ThemeProvider>
			<Layout direction="column" className={styles.page}>
				<Text size="2xl" weight="bold" as="h1">
					Аналитическая таблица проектов
				</Text>
				{/* Здесь мы позже вставим нашу страницу <ProjectsPage /> */}
				<Text view="secondary">Начните реализацию здесь</Text>
			</Layout>
		</ThemeProvider>
	);
}

export default App;

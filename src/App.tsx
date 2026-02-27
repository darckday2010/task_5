import { Layout } from "@consta/uikit/Layout";
import { Text } from "@consta/uikit/Text";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import styles from "./App.module.css";

function App() {
	return (
		<ThemeProvider>
			<Layout direction="column" className={styles.page}>
				<Text size="2xl" weight="bold" as="h1">
					Аналитическая таблица проектов
				</Text>
				<ProjectsPage />
			</Layout>
		</ThemeProvider>
	);
}

export default App;

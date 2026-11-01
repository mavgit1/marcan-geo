import { langs } from '$lib/i18n';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

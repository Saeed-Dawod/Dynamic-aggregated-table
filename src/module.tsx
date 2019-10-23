import { PanelPlugin } from '@grafana/ui';
import { statusTableEditor } from "./statusTableEditor";
import { defaults} from './types';
import './style/module.css';
import { StatusTablePanel } from './statusTablePanel';

export const plugin = new PanelPlugin(StatusTablePanel)
  .setDefaults(defaults)
  .setEditor(statusTableEditor);

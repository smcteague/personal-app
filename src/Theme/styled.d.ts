import 'styled-components';
import { Theme } from '@mui/icons-material/styles';


declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}


/**
 * ConfigurationParameters Interface
 */
export interface ConfigurationParameters {
  baseUrl: string; // override base path
}
/**
 * Configuration Class
 */
class Configuration {
  readonly baseUrl: string;

  constructor(private configuration: ConfigurationParameters = { baseUrl: '' }) {
    this.baseUrl = configuration.baseUrl;
  }
}

export default Configuration;

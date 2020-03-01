import * as React from "react";
import styles from "./ReactWebPartDemo.module.scss";
import { IReactWebPartDemoProps } from "./IReactWebPartDemoProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { IColor } from "../IColor";
import { ColorList, IColorListProps } from "./ColorList";
import { IReactWebPartDemoState } from "./IReactWebPartDemoState";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export default class ReactWebPartDemo extends React.Component<
  IReactWebPartDemoProps,
  IReactWebPartDemoState
> {
  constructor(props: IReactWebPartDemoProps) {
    super(props);
    this.state = { colors: [] };
  }

  public componentDidMount(): void {
    this.getColorsFromSpList().then((spListItemColors: IColor[]) => {
      this.setState({ colors: spListItemColors });
    });
  }

  private _colors: IColor[] = [
    { id: 1, title: "red" },
    { id: 2, title: "blue" },
    { id: 3, title: "green" }
  ];

  private getColorsFromSpList(): Promise<IColor[]> {
    return new Promise<IColor[]>((resolve, reject) => {
      const endpoint: string = `${this.props.currentSiteUrl}/_api/lists/getbytitle('Todo')/items?$select=Id,Title`;
      console.log("endpoint", endpoint);
      this.props.spHttpClient
        .get(endpoint, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .then((jsonResponse: any) => {
          console.log("jsonResponse", jsonResponse);
          let spListItemColors: IColor[] = [];
          for (let index = 0; index < jsonResponse.value.length; index++) {
            spListItemColors.push({
              id: jsonResponse.value[index].Id,
              title: jsonResponse.value[index].Title
            });

            resolve(spListItemColors);
          }
        });
    });
  }

  private _removeColor = (colorToRemove: IColor): void => {
    const newColors = this.state.colors.filter(color => color != colorToRemove);
    this.setState({ colors: newColors });
  };

  public render(): React.ReactElement<IReactWebPartDemoProps> {
    return (
      <div className={styles.reactWebPartDemo}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>
                Welcome to SharePoint + React!
              </span>
              <ColorList
                colors={this.state.colors}
                onRemoveColor={this._removeColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

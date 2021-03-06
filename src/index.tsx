require("./assets/css/randompassword.less");

import * as React from "react";
import * as ReactDOM from "react-dom";

import { action, observable, useStrict } from "mobx";
import { observer } from "mobx-react";

import { hashSync } from "bcryptjs";

@observer
class RandomPassForm extends React.Component<{}, {}> {

    /**
     * The key part of the password.
     */
    @observable
    private _key: string = "";

    /**
     * The `className` attribute value for the key input.
     */
    @observable
    private _keyInputClass: string = "textInput";

    /**
     * Whether the entered key should be visible or be displayed as a password.
     */
    @observable
    private _keyVisible: boolean = false;

    /**
     * The name part of the password.
     */
    @observable
    private _name: string = "";

    /**
     * The `className` attribute value for the name input.
     */
    @observable
    private _nameInputClass: string = "textInput";

    /**
     * Whether the entered name should be visible or be displayed as a password.
     */
    @observable
    private _nameVisible: boolean = false;

    /**
     * The calculated password.
     */
    @observable
    private _password: string = "";

    /**
     * Whether the password field should be hidden or not.
     */
    @observable
    private _passwordHidden: boolean = true;

    /**
     * Whether the user have entered a valid name and key pair a password
     * can be generated from.
     */
    private get hasValidNameAndKey(): boolean {
        let result: boolean = true;
        if (this._name.length < 3) {
            result = false;
            this._nameInputClass = "textInput invalidTextInput";
        }
        if (this._key.length < 3) {
            result = false;
            this._keyInputClass = "textInput invalidTextInput";
        }
        return result;
    }

    public render(): JSX.Element {
        return (
            <table><tbody>
                <tr>
                    <td className="inputDescription" >Name:</td>
                    <td className="inputColumn">
                        <input type={this._nameVisible ? "text" : "password"}
                            name="nameInput" maxLength={30}
                            className={this._nameInputClass}
                            placeholder="Enter a name." value={this._name}
                            onChange={this.handleNameChange} />
                    </td>
                    <td className="checkboxColumn">
                    <div className={"checkboxBase " + (this._nameVisible ? "checkboxSelected" : "checkboxEmpty")}
                            onClick={this.toggleNameVisibility}
                            tabIndex={-1} >
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="inputDescription" >Key:</td>
                    <td className="inputColumn">
                        <input type={this._keyVisible ? "text" : "password"}
                            name="keyInput" maxLength={30}
                            className={this._keyInputClass}
                            placeholder="Enter your secret key." value={this._key}
                            onChange={this.handleKeyChange} />
                    </td>
                    <td className="checkboxColumn">
                        <div className={"checkboxBase " + (this._keyVisible ? "checkboxSelected" : "checkboxEmpty")}
                            onClick={this.toggleKeyVisibility}
                            tabIndex={-1} >
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={this.showPassword} className="execute">
                            Show&nbsp;password
                        </button>
                    </td>
                    <td>
                        <input type="text" name="passwordLabel"
                            readOnly={true} className="textInput"
                            value={this._password} hidden={this._passwordHidden} />
                    </td>
                    <td className="checkboxColumn">
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <hr />
                        <p>Password generator that converts a name and key pair into a <em>strong,
                        random-looking password.</em></p>

                        <p>The page will <b>not send or store</b> the entered <b>data</b> in any way,&nbsp;
                        <em>everything is calculated on your own machine</em>.</p>

                        <p>For more information or for the browser extensions, visit the
                        project's <a href="https://github.com/volfpeter/randompassword">GitHub page</a>.</p>

                        <h4>Example</h4>

                        <p>Let's say you would like easy to remember but strong and different
                        passwords for your email, twitter and facebook accounts. First of all,
                        you need to come up with an <em>easy to remember but not trivial key</em>
                        that you will use for all these accounts, "may the 4th be with you" for
                        example. Then you have come up with <em>easy to remember but not trivial
                        names</em> for all services, say "yoda's ml", "yoda's tw" and "yoda's fb".
                        Now you can use this tool to create different and strong passwords for
                        each of your accounts by combining the selected names with the selected key:</p>

                        <p><em>"yoda's ml"</em> with <em>"may the 4th be with you"</em> will give
                        you <em>"v38ukjtauEHw2ap"</em> as your password for your email account.</p>
                        <p><em>"yoda's tw"</em> with <em>"may the 4th be with you"</em> will give
                        you <em>"wsZqn/J7wr7EOzgC"</em> as your password for your twitter account.</p>
                        <p>Finally, <em>"yoda's fb"</em> with <em>"may the 4th be with you"</em> will
                        give you <em>"nr4fffTJj7OjH"</em> as your password for your facebook account.</p>
                    </td>
                </tr>
            </tbody></table>
        );
    }

    /**
     * Generates a new password.
     */
    private generatePassword = (): string => {
        if (!this.hasValidNameAndKey) {
            return "";
        }

        const data: string = this.getBCryptData();
        const salt: string = this.getBCryptSalt();
        const hash: string = hashSync(data, salt);
        let length: number = this.sumCharacterCodes(hash) % 17;
        if (length < 7) {
            length = 17 - length;
        }

        return hash.substr(salt.length, length);
    }

    /**
     * Returns the salt for bcrypt to use.
     */
    private getBCryptSalt = (): string => {
        const base: string = encodeURIComponent(this._name);
        const version: string = "2b";
        const cost: string = "10";

        let salt: string = base;
        while (salt.length < 22) {
            salt += base;
        }
        salt = btoa(salt).substr(0, 22);
        return "$" + version + "$" + cost + "$" + salt;
    }

    /**
     * Returns the data for bcrypt to hash.
     */
    private getBCryptData = (): string => {
        const base: string = encodeURIComponent(this._key);

        return btoa(base);
    }

    /**
     * Handles the change events of the key input.
     */
    @action
    private handleKeyChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this._password = "";
        this._passwordHidden = true;
        this._key = event.currentTarget.value;
        this._keyInputClass = "textInput";
    }

    /**
     * Handles the change events of the name input.
     */
    @action
    private handleNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this._password = "";
        this._passwordHidden = true;
        this._name = event.currentTarget.value;
        this._nameInputClass = "textInput";
    }

    /**
     * Generates a password from the currently entered name and key
     * and makes it visible in the password label.
     */
    @action
    private showPassword = (event: any): void => {
        this._password = this.generatePassword();
        this._passwordHidden = false;
    }

    /**
     * Returns the sum of the character codes of the characters
     * in the given string.
     *
     * @param value  The string to sum.
     */
    private sumCharacterCodes = (value: string): number => {
        let result: number = 0;
        for (const c of value) {
            result += c.charCodeAt(0);
        }
        return result;
    }

    /**
     * Toggles the visibility of the entered key.
     */
    @action
    private toggleKeyVisibility = (event: any): void => {
        this._keyVisible = !this._keyVisible;
    }

    /**
     * Toggles the visibility of the entered name.
     */
    @action
    private toggleNameVisibility = (event: any): void => {
        this._nameVisible = !this._nameVisible;
    }

}

// Enable Mobx strict mode to force some consistency upon ourselves
useStrict(true);

ReactDOM.render(<RandomPassForm />, document.getElementById("root"));

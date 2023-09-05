//ALERTS
const accountCreatedAlert = "Account was added."
const accountAlreadyExistsAlert = "Account already exists."
const noAccountAlert = "Account does not exist."
const noAccountsAlert = "No accounts."
const accountWithLeastSpaceAlert = "Account with least free space:"
const uploadSuccessAlert = "File uploaded into account."
const fileAlreadyExistsAlert = "File already exists in the account."
const fileTooLargeAlert = "File size exceeds account capacity."
const fileSharedAlert = "File was shared."
const noFileAlert = "File does not exist."
const shareNotAllowedAlert = "Account does not allow file sharing."
const fileAlreadySharedAlert = "File already shared."
const fileWasNotSharedAlert = "File not shared."
const displayAllFilesAlert = "Account files:"
const displayAllAccountsAlert = "All accounts:"
const updateSuccessAlert = "File was updated."
const displayLastUpdateAlert = "Last update:"
const exitAlert = "Exiting..."
const invalidCommandAlert = "Invalid command."

//PROMPS
const addPrompt = "ADD: Create a new user account"
const uploadPrompt = "UPLOAD: Add a file to an account"
const sharePrompt = "SHARE: Share a file with another user"
const minspacePrompt = "MINSPACE: Find the account with the least free space"
const listfilesPrompt = "LISTFILES: Display a user's files"
const listallPrompt = "LISTALL: View all registered accounts"
const updatePrompt = "UPDATE: Simulate updating a file"
const lastUpdatePrompt = "LASTUPDATE: Retrieve the account that most recently updated a file"
const exitPrompt = "EXIT: Terminate the application"

const promptMsg = addPrompt+"\n"+uploadPrompt+"\n"+sharePrompt+"\n"+minspacePrompt+"\n"+listfilesPrompt+"\n"+listallPrompt+"\n"+updatePrompt+"\n"+lastUpdatePrompt+"\n"+exitPrompt


class Cloud {
    #accounts = null;

    constructor() {
        this.#accounts = [];
    }

    get accounts() {
        return this.#accounts;
    }

    getAccount(email) {
        return this.accounts.find((account) => account.email === email)
    }

    addAccount(email, accountType) {
        const newId = this.getIdNumber()
        let newAccount
        if (accountType === "basic") {
            newAccount = new BasicAccount(email, newId)
        } else if (accountType === "premium") {
            newAccount = new PremiumAccount(email, newId)
        }
        this.accounts.push(newAccount); 
    }

    displayAllAccounts() {
        const listToDisplay = this.accounts.map((account) => `${account.email} (${account instanceof BasicAccount ? "Basic" : "Premium"})`);
        return listToDisplay.join("\n");
    }

    getAccountWithLeastSpace() { 
        const accountWithLeastSpace = this.accounts.toSorted((accountA, accountB) => accountA.getAccountSpace() - accountB.getAccountSpace() || accountA.id - accountB.id)
  
        return accountWithLeastSpace.length === 0 ? false : accountWithLeastSpace[0].email
    }

    getMostRecentId() {
        return this.accounts.toSorted((accountA, accountB) => accountB.id - accountA.id)[0]
    }

    getIdNumber() {
        const allAccounts = this.accounts
        return allAccounts.length > 0 ? this.getMostRecentId(allAccounts).id + 1 : 0
    }
    
    getNewPrompt() {
        const newInput = new Prompt();
        this.useCommand(newInput);
    }
    
    addCommand(data) {
        const [accountEmail, accountType] = data

        const account = this.getAccount(accountEmail)

        if (account) {
            alert(accountAlreadyExistsAlert)
            alert("")
        } else {
            this.addAccount(accountEmail, accountType)
            alert(accountCreatedAlert)
            alert("")
        }
    }

    uploadCommand(data) {
        const [fileOwnerEmail, fileName, fileSize] = data

        const fileOwner = this.getAccount(fileOwnerEmail)

        if (!fileOwner) {
            alert(noAccountAlert) 
            alert("")
        } else {
            const uploadCheck = fileOwner.uploadFile(fileName, fileSize, fileOwner.email)

            if (uploadCheck.error === true) {
                alert(uploadCheck.errorMessage)
                alert("")
            } else {
                alert(uploadSuccessAlert)
                alert("")
            }
        }
    }

    shareCommand(data) {
        const [ownerAccountEmail, receivingAccountEmail, sharedFileName] = data

        const ownerAccount = this.getAccount(ownerAccountEmail)
        const receivingAccount = this.getAccount(receivingAccountEmail)

        if (!ownerAccount || !receivingAccount) {
            alert(noAccountAlert)
            alert("")
        } else {
            const sharedFile = ownerAccount.shareFile(sharedFileName)
 
            if (sharedFile.error === true) {
                alert(sharedFile.errorMessage)
                alert("")
            } else {
                const fileReceivingCheck = receivingAccount.receiveSharedFile(sharedFile)

                if (fileReceivingCheck.error === true) {
                    alert(fileReceivingCheck.errorMessage)
                    alert("")
                } else {
                    alert(fileSharedAlert)
                    alert("")
                }
            }
        }
    }

    minspaceCommand() {
        const accountWithLeastSpace = this.getAccountWithLeastSpace();

        if (!accountWithLeastSpace) {
            alert(noAccountsAlert)
            alert("")
        } else {
            alert(accountWithLeastSpaceAlert+" "+accountWithLeastSpace)
            alert("")
        }
    }

    listFilesCommand(data) {
        const [filesOwnerEmail] = data

        const filesOwner = this.getAccount(filesOwnerEmail)

        if (!filesOwner) {
            alert(noAccountAlert)
            alert("")
        } else {
        const filesList = filesOwner.displayAccountFiles()

        alert(displayAllFilesAlert+"\n"+filesList);
        alert("")
        }
    }

    listAllAccountsCommand() {
        const accountsList = this.displayAllAccounts()

        alert(displayAllAccountsAlert+"\n"+accountsList);
        alert("")
    }

    updateFileCommand(data) {
        const [fileOwnerEmail, updatingAccountEmail, fileName] = data

        const fileOwner = this.getAccount(fileOwnerEmail);
        const updatingAccount = this.getAccount(updatingAccountEmail);

        if (!fileOwner || !updatingAccount) {
            alert(noAccountAlert);
            alert("")
        } else if (!fileOwner.hasFile(fileName, fileOwner.email)) {
            alert(noFileAlert);
            alert("")
        } else {
            const file = fileOwner.getFile(fileName);
            const updateFileCheck = updatingAccount.updateFile(file)

            if (updateFileCheck) {
                alert(updateSuccessAlert)
                alert("")
            } else {
                alert(fileWasNotSharedAlert);
                alert("")
            }
        }
    }

    lastUpdateCommand(data) {
        const [fileOwnerEmail, fileName] = data
  
        const fileOwner = this.getAccount(fileOwnerEmail)

        if (!fileOwner) {
            alert(noAccountAlert);
            alert("")
        } else {
            const lastUpdateAuthor = fileOwner.getLastUpdateAuthor(fileName) 

            if (lastUpdateAuthor.error) {
                alert(lastUpdateAuthor.errorMessage)
                alert("")
            } else {
                alert(displayLastUpdateAlert+" "+lastUpdateAuthor)
                alert("")
            }
        }
    }

    useCommand(input) {
        const command = input.command
        const data = input.data 

        switch(command) {
            case "ADD": 
                this.addCommand(data)
                break;
            case "UPLOAD":
                this.uploadCommand(data)
                break;
            case "SHARE":
                this.shareCommand(data)
                break;
            case "MINSPACE":
                this.minspaceCommand()
                break;
            case "LISTFILES":
                this.listFilesCommand(data)
                break;
            case "LISTALL":
                this.listAllAccountsCommand()
                break;
            case "UPDATE":
                this.updateFileCommand(data)
                break;
            case "LASTUPDATE":
                this.lastUpdateCommand(data)
                break;
            case "EXIT":
                alert(exitAlert);
                alert("")
                return 
            default:
                alert(invalidCommandAlert);
                break;
        }
        const newInput = new Prompt()
        this.useCommand(newInput)
    }  
}

class Prompt { 
    #prompt = null
    #command = null
    #data= null

    constructor() {
        this.#prompt = this.askPrompt();
        this.#command = this.extractCommand(this.prompt)
        this.#data = this.extractData(this.prompt)
    }

    get prompt() {
        return this.#prompt
    }

    set command(newCommand){
        this.#command = newCommand;
    }
    
    get command() {
        return this.#command
    }

    set data(newData) {
        this.#data = newData;
    }

    get data() {
        return this.#data
    }

    askPrompt() {
        const newPrompt = prompt(promptMsg)
        return newPrompt
    }

    splitPrompt() {
        return this.prompt.split(" ");
    }

    extractCommand() {
        return this.prompt ? this.splitPrompt(this.prompt)[0] : false;
    }

    extractData() {
        return this.prompt ? this.splitPrompt(this.prompt).slice(1) : false;
    }

}

class Account {

    #email = null;  
    #accountSpace = null;
    #sharedFileWeight = null;
    #id = null;
    #files = null;

    constructor(email, id) {
        this.#email = email;
        this.#accountSpace = 0;
        this.#sharedFileWeight = 1;
        this.#id = id;
        this.#files = []
    }

    get email() {
        return this.#email;
    }

    get files() {
        return this.#files;
    }

    get accountSpace() {
        return this.#accountSpace;
    }

    set accountSpace(space) {
        this.#accountSpace = space;
    }

    get sharedFileWeight() {
        return this.#sharedFileWeight
    }

    set sharedFileWeight(weight) {
        this.#sharedFileWeight = weight
    }

    get id() {
        return this.#id;
    }

    addFileToAccount(file) { 
        this.#files.push(file);
    }

    uploadFile(fileName, fileSize, fileOwnerEmail) {
        
        if (this.hasFile(fileName, fileOwnerEmail)) {
            return {error: true, errorMessage: fileAlreadyExistsAlert}
        } else if (this.checkAvailableSpace(fileSize)) { 
            return {error: true, errorMessage: fileTooLargeAlert}
        } else {
            let file = new File(fileName, fileSize, fileOwnerEmail)
            this.addFileToAccount(file)
            return {error: false}
        }
    }

    shareFile(sharedFileName) {
            
        if (this instanceof BasicAccount) {
            return {error: true, errorMessage: shareNotAllowedAlert}
        } 
        
        const sharedFile = this.getFile(sharedFileName)

        if (sharedFile) { 
            return sharedFile
        } else {
            return {error: true, errorMessage: noFileAlert} 
        }
    }

    getLastUpdateAuthor(fileName) {
        if (!this.hasFile(fileName, this.email)) {
            return {error: true, errorMessage: noFileAlert}
        }

        const file = this.getFile(fileName)
        const lastUpdate = file.getMostRecentRecord()
        return lastUpdate ? lastUpdate.author : this.email
    }

    hasFile(fileName, ownerEmail) {
        const file = this.files.find((file) => file.name === fileName && file.ownerEmail === ownerEmail)
        return file ? true : false
    }

    getFile(fileName) {
        return this.filterOwnFiles().find((file) => file.name === fileName)
    }

    checkAvailableSpace(size) {
        return this.getAccountSpace() < size
    }   

    receiveSharedFile(file) {
        const fileWeight = this.calculateSharedFileWeight(file.size)

        if (this.hasFile(file.name, file.ownerEmail)) { 
            return {error: true, errorMessage: fileAlreadySharedAlert}
        }

        const fileTooLarge = this.checkAvailableSpace(fileWeight)
        
        if (fileTooLarge) {
            return {error: true, errorMessage: fileTooLargeAlert}
        } else {
            this.addFileToAccount(file)
            return {error: false}
        }
    }

    displayAccountFiles() {
        const listToDisplay = this.files.map((file) => {
            let shareStatus = ""
            if (file.ownerEmail !== this.email) {
                shareStatus = " (shared)"
            }
            return `${file.name} (${file.size} MB)${shareStatus}`
        })
        return listToDisplay.join("\n");
    }

    filterOwnFiles() {
        return this.files.filter((file) => file.ownerEmail === this.email);
    }

    filterSharedFiles() {
        return this.files.filter((file) => file.ownerEmail !== this.email);
    }

    getAccountSpace() {
        const ownWeight = this.filterOwnFiles().reduce((accWeight, file) => accWeight + file.size, 0)
        const sharedWeight = this.filterSharedFiles().reduce((accWeight, file) => accWeight + this.calculateSharedFileWeight(file.size), 0);

        return this.accountSpace - (ownWeight + sharedWeight)
    }
    
    updateFile(file) {
        if (!this.hasFile(file.name, file.ownerEmail)) {
            return false
        } else {
            file.updateFileHistory(this.email);
            return true
        }
    }

    calculateSharedFileWeight(fileSize) {
        return fileSize * this.sharedFileWeight
    }
}

class BasicAccount extends Account{

    constructor(email, id) {
        super(email, id)
        this.accountSpace = 2048
        this.sharedFileWeight = 0.5
    }  
}

class PremiumAccount extends Account {

    constructor(email, id) {
        super(email, id)
        this.accountSpace = 5120
        this.sharedFileWeight = 0
    }
}

class File {
    #name = null;
    #size = null;
    #ownerEmail = null; 
    #updateHistory = null;

    constructor(name, size, ownerEmail) {
        this.#name = name;
        this.#size = parseFloat(size);
        this.#ownerEmail = ownerEmail;
        this.#updateHistory = [];
    }

    get name() {
        return this.#name;
    }

    get size() {
        return this.#size;
    }

    get ownerEmail() {
        return this.#ownerEmail;
    }

    get updateHistory() {
        return this.#updateHistory;
    }

    updateFileHistory(accountEmail) { 
        const lastUpdate = this.getMostRecentRecord(); 

        let nextId
        lastUpdate ? nextId = lastUpdate.id + 1 : nextId = 0

        this.#updateHistory.push({id: nextId, author: accountEmail})
    }

    getMostRecentRecord() {
        return this.updateHistory.toSorted((recordA, recordB) => recordB.id - recordA.id)[0]
    }
}

const newCloud = new Cloud()
newCloud.getNewPrompt()
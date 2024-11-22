import { Tag } from "../../utils/Constants.ts";
import { Autocomplete, TextField } from "@mui/material";

// type TagAutocompleteProps={
//     tags:Tag[];
// }


type TagAutocompleteProps = {
    suggestedTags: Tag[];
    selectedTags: (string | Tag)[];
    inputValue: string;
    handleChange: (_event: React.SyntheticEvent, newValue: (string | Tag)[]) => void;
    handleInputChange: (_event: React.SyntheticEvent, newInputValue: string) => void;
    helperText?: string;
};

export const TagAutocomplete=({suggestedTags,selectedTags,inputValue,handleChange,handleInputChange,helperText}:TagAutocompleteProps)=>{
    return(
        <Autocomplete
            multiple
            id="tags-input"
            options={suggestedTags}
            value={selectedTags}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            getOptionLabel={(option) => typeof option === "string" ? option : option.label}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tags"
                    helperText={helperText?helperText:""}
                />
            )}
            freeSolo
        />
    )
}
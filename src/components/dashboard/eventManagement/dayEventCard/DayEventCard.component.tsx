import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  LinearProgress,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, { useCallback, useContext, useState } from "react";
import { DayEvent } from "../../../../api/hooks/dayEvents";
import { TDayEvent } from "../../../../api/types/dayEvent";
import { UserContext } from "../../../app/App";

type DayEventCardProps = {
  event?: TDayEvent;
  readonly?: boolean;
  finished?: boolean;
};

export const DayEventCard: React.FC<DayEventCardProps> = ({
  event,
  readonly,
  finished,
}) => {
  const user = useContext(UserContext);
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);

  const { upload, progress, error, uploading } = DayEvent(user!).useSetDayEvent(
    () => {
      setTitle("");
      setDescription("");
      setImageUrl("");
      setSelectedFile(null);
    }
  );

  const handleCapture = useCallback(({ target }: any) => {
    var file = target.files[0];
    setSelectedFile(file);
    setImageUrl(window.URL.createObjectURL(file));
  }, []);

  const handleInputChange = useCallback(
    (valueSetter: React.Dispatch<React.SetStateAction<string>>) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        valueSetter(event.target.value);
      },
    []
  );

  const addCardHandler = useCallback(
    async (event) => {
      event.preventDefault();
      upload(
        {
          title,
          description,
          imageUrl: "",
        },
        selectedFile
      );
    },
    [description, selectedFile, title, upload]
  );

  const deleteCardHandler = useCallback(async () => {
    await DayEvent(user!).deleteDayEvent(event!.id!);
  }, [event, user]);

  return (
    <Box sx={{ padding: 2, maxWidth: 300 }}>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Card variant="outlined">
        <form onSubmit={addCardHandler}>
          {(selectedFile || event?.imageUrl) && (
            <CardMedia
              component="img"
              height="140"
              image={imageUrl}
              alt="thumbnail"
            />
          )}
          {uploading && (
            <LinearProgress variant="determinate" value={progress} />
          )}
          <CardContent>
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              display="flex"
              flexDirection="column"
            >
              <TextField
                required
                id="title"
                label="Name"
                disabled={!!event}
                value={title}
                onInput={handleInputChange(setTitle)}
              />
              <TextField
                id="description"
                multiline
                disabled={!!event}
                maxRows={4}
                label="description"
                value={description}
                onInput={handleInputChange(setDescription)}
              />
              {!event && (
                <Button variant="contained" component="label">
                  Upload File
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg"
                    onChange={handleCapture}
                    disabled={uploading}
                  />
                </Button>
              )}
            </Box>
          </CardContent>
          {!readonly && (
            <CardActions>
              {!event && (
                <Button type="submit" size="small" disabled={uploading}>
                  Add
                </Button>
              )}
              {event && (
                <Button size="small" onClick={deleteCardHandler}>
                  Delete
                </Button>
              )}
            </CardActions>
          )}
        </form>
        {finished && (
          <Box
            sx={{
              position: "relative",
              bottom: "10%",
            }}
          >
            <CheckBoxIcon />
          </Box>
        )}
      </Card>
    </Box>
  );
};

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useContext, useState } from "react";
import { DayEvent } from "../../../../api/hooks/dayEvents";
import { TDayEvent } from "../../../../api/types/dayEvent";
import { UserContext } from "../../../app/App";

type DayEventCardProps = {
  event?: TDayEvent;
};

export const DayEventCard: React.FC<DayEventCardProps> = ({ event }) => {
  const user = useContext(UserContext);
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);

  const handleCapture = ({ target }: any) => {
    var file = target.files[0];
    setSelectedFile(file);
    setImageUrl(window.URL.createObjectURL(file));
  };

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
      await DayEvent(user!).setDayEvent(
        {
          title,
          description,
          imageUrl: "",
        },
        selectedFile
      );
      setTitle("");
      setDescription("");
      setImageUrl("");
      setSelectedFile(null);
    },
    [description, selectedFile, title, user]
  );

  const deleteCardHandler = useCallback(async () => {
    await DayEvent(user!).deleteDayEvent(event!.id!);
  }, [event, user]);

  return (
    <Box sx={{ padding: 2, maxWidth: 300 }}>
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
                rows={5}
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
                  />
                </Button>
              )}
            </Box>
          </CardContent>

          <CardActions>
            {!event && (
              <Button type="submit" size="small">
                Add
              </Button>
            )}
            {event && (
              <Button size="small" onClick={deleteCardHandler}>
                Delete
              </Button>
            )}
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};

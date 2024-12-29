import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IToDo, toDoState } from "../atom";
import DraggableCard from "./DraggableCard";
import React from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 200px;
  height: 300px;
  display: flex;

  background-color: ${(props) => (props.isDragging ? "#c2cadb" : "#dadfe9")};

  transition: background-color 0.5s ease-in-out;

  padding: 10px;

  border-radius: 10px;

  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  text-align: center;
  width: 100%;
  font-size: 18px;
  font-weight: 400;
`;

const Form = styled.form`
  width: 100%;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  &:focus {
    outline: 1px solid #7f8081;
  }

  border-radius: 5px;

  color: #7f8081;

  height: 25px;

  border: none;

  background-color: white;

  text-align: center;
`;

interface IAreaProps {
  draggingFromThisWith: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.draggingFromThisWith
      ? "#b2bec3"
      : "transparent"};

  transition: background-color 0.5s ease-in-out;
  flex-grow: 1;
  padding: 20px;
  border-radius: 5px;
  min-height: 200px;
`;

interface IBoard {
  boardId: string;
  toDos: IToDo[];
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ boardId, toDos, index }: IBoard) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  return (
    <Draggable draggableId={"Board_" + boardId} index={index}>
      {(provided, snapshot) => (
        <Wrapper
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          datatype="Board"
        >
          <Title>{boardId}</Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <Input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add Task on ${boardId}`}
              autoComplete="off"
            ></Input>
          </Form>
          <Droppable droppableId={boardId}>
            {(provided, snapshot) => (
              <Area
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
                draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
              >
                {toDos.map((toDo, index) => (
                  <DraggableCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  ></DraggableCard>
                ))}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);

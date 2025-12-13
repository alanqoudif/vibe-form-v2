"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  GripVertical, 
  Type, 
  AlignLeft, 
  CircleDot, 
  CheckSquare, 
  Sliders, 
  Star, 
  ChevronDown 
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormStore } from '@/lib/stores/form-store';
import type { FormQuestion } from '@/types/database';
import { cn } from '@/lib/utils';

const questionIcons: Record<string, React.ElementType> = {
  short_text: Type,
  long_text: AlignLeft,
  mcq: CircleDot,
  checkbox: CheckSquare,
  likert: Sliders,
  rating: Star,
  dropdown: ChevronDown,
};

interface SortableQuestionProps {
  question: FormQuestion;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

function SortableQuestion({ question, index, isSelected, onClick }: SortableQuestionProps) {
  const t = useTranslations('builder');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = questionIcons[question.type] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
        isSelected 
          ? "bg-primary/10 border-primary/50" 
          : "bg-card border-border hover:bg-accent",
        isDragging && "opacity-50"
      )}
      onClick={onClick}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">
          {question.title || `${t('question') || 'Question'} ${index + 1}`}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {question.type.replace('_', ' ')}
        </p>
      </div>

      {question.required && (
        <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">
          {t('required')}
        </Badge>
      )}
    </div>
  );
}

export function QuestionList() {
  const t = useTranslations('builder');
  const { questions, selectedQuestionId, selectQuestion, reorderQuestions, addQuestion } = useFormStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      reorderQuestions(oldIndex, newIndex);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: FormQuestion = {
      id: `temp-${Date.now()}`,
      form_id: '',
      order_index: questions.length,
      type: 'short_text',
      title: t('newQuestion') || 'New Question',
      description: null,
      required: false,
      options: null,
      logic: null,
      created_at: new Date().toISOString(),
    };
    addQuestion(newQuestion);
    selectQuestion(newQuestion.id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Button
          onClick={handleAddQuestion}
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addQuestion')}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questions.map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((question, index) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  isSelected={selectedQuestionId === question.id}
                  onClick={() => selectQuestion(question.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">{t('noQuestions') || 'No questions yet'}</p>
              <p className="text-xs mt-1">{t('clickToAdd') || 'Click the button above to add one'}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

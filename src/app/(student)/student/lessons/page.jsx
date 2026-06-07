import { redirect } from 'next/navigation';

// The lesson library lives under the alphabet grid; individual lessons are at
// /student/lessons/[id]. This index just forwards there.
export default function LessonsIndex() {
  redirect('/student/learn/alifbo');
}

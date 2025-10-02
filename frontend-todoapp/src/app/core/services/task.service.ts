import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TodoTask, CreateTodoTask, UpdateTodoTask, TaskStatistics, TaskFilter } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(filter?: TaskFilter): Observable<TodoTask[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.isCompleted !== undefined) {
        params = params.set('isCompleted', filter.isCompleted.toString());
      }
      if (filter.priority !== undefined) {
        params = params.set('priority', filter.priority.toString());
      }
      if (filter.searchTerm) {
        params = params.set('searchTerm', filter.searchTerm);
      }
      if (filter.createdAfter) {
        params = params.set('createdAfter', filter.createdAfter);
      }
      if (filter.createdBefore) {
        params = params.set('createdBefore', filter.createdBefore);
      }
      if (filter.page) {
        params = params.set('page', filter.page.toString());
      }
      if (filter.pageSize) {
        params = params.set('pageSize', filter.pageSize.toString());
      }
    }

    return this.http.get<TodoTask[]>(this.apiUrl, { params });
  }

  getTask(id: number): Observable<TodoTask> {
    return this.http.get<TodoTask>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTodoTask): Observable<TodoTask> {
    return this.http.post<TodoTask>(this.apiUrl, task);
  }

  updateTask(id: number, updates: UpdateTodoTask): Observable<TodoTask> {
    return this.http.put<TodoTask>(`${this.apiUrl}/${id}`, updates);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleTask(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle`, {});
  }

  getStatistics(): Observable<TaskStatistics> {
    return this.http.get<TaskStatistics>(`${this.apiUrl}/statistics`);
  }
}
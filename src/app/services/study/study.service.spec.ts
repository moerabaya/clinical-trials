import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StudyService, TIME_DELAY } from './study.service';
import { environment } from '../../../environments/environment';

const mockedStudies = [
  {
    protocolSection: {
      identificationModule: {
        nctId: 'NCT01402479',
        briefTitle:
          'An Open-labeled Trial of Ramipril in Patients With Migraine',
        officialTitle:
          'An Open-labeled Trial of Ramipril in Patients With Migraine',
      },
      statusModule: {
        studyFirstSubmitDate: '2011-07-24',
      },
    },
  },
];

const params = {
  pageSize: 10,
  fields: 'BriefTitle%7COfficialTitle%7CStudyFirstSubmitDate',
};

describe('StudyService', () => {
  let service: StudyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudyService],
    });

    service = TestBed.inject(StudyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch initial items', () => {
    const mockResponse: Root = {
      studies: mockedStudies,
      nextPageToken: 'token',
    };

    service.getItems().subscribe((items: Study[]) => {
      expect(items.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `${environment.api}?pageSize=${params.pageSize}&fields=${params.fields}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch additional items every 5 seconds', () => {
    const mockResponse: Root = {
      studies: mockedStudies,
      nextPageToken: 'token',
    };

    service.getItems().subscribe((items: Study[]) => {
      expect(items.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `${environment.api}?pageSize=${params.pageSize}&fields=${params.fields}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    setTimeout(() => {
      const additionalReq = httpMock.expectOne(
        `${environment.api}?pageSize=1&pageToken=token&fields=${params.fields}`
      );
      expect(additionalReq.request.method).toBe('GET');
      additionalReq.flush(mockResponse);
    }, TIME_DELAY);
  });

  it('should handle loading state correctly', () => {
    const mockResponse: Root = {
      studies: mockedStudies,
      nextPageToken: 'token',
    };

    service.getItems().subscribe();

    const req = httpMock.expectOne(
      `${environment.api}?pageSize=${params.pageSize}&fields=${params.fields}`
    );
    expect(service.loading$.getValue()).toBe(true);

    req.flush(mockResponse);
    expect(service.loading$.getValue()).toBe(false);
  });
});

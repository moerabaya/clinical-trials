declare interface Root {
  studies: Study[];
  nextPageToken: string;
}

declare interface Study {
  protocolSection: ProtocolSection;
}

declare interface ProtocolSection {
  identificationModule: IdentificationModule;
  statusModule: StatusModule;
}

declare interface IdentificationModule {
  nctId: string;
  briefTitle: string;
  officialTitle: string;
}

declare interface StatusModule {
  studyFirstSubmitDate: string;
}

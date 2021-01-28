


export interface ISerializableObject {
    [x: string]: any;
    //fromJson: (json_data) => any;
  }
  
  export interface IParsedResponse {
    ok: boolean;
    model: ISerializableObject,
    errors: string;
    data: any;
  }
/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./utils/lucia").Auth;
	type DatabaseUserAttributes = {
		email: string;
		username: string;
	};
	type DatabaseSessionAttributes = {};
}

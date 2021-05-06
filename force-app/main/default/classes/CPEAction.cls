public with sharing class CPEAction {

    public class Request {
        @InvocableVariable
        public String query;

        @InvocableVariable
        public Integer count;

        @InvocableVariable
        public Boolean active;
    }

    public class Result {
        @InvocableVariable
        public List<User> users;
    }

    @InvocableMethod(
        label='Search Users'
        category='Test'
        configurationEditor='c-cpe-action-editor'
    )
    public static List<Result> execute(List<Request> requests) {
        Request req = requests.get(0);
        String search = '%' + req.query + '%';
        List<User> users = [
            SELECT Id, Name
            FROM User
            WHERE Name LIKE :search AND IsActive = :req.active
            LIMIT :req.count
        ];
        Result res = new Result();
        res.users = users;
        return new List<Result>{res};
    }
}
